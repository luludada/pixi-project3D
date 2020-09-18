let CHARA = [];
let EXTERUD = [];
let EXTERUDQuality = 50;

/** @extends PIXI.Application */
class _app extends PIXI.Application {
    constructor(option) {
        super({
            width: 1500, 
            height: 1200,                       
            antialias: true, 
            transparent: false, 
            resolution: 1, 
            sharedTicker:true, 
            backgroundColor: 0x2c3e50
          });
          document.body.appendChild(this.view);
          this.initialize();
    };

    initialize(){
        this.loader
        .add('plane', 'https://pixijs.io/examples-v4/examples/assets/bg_plane.jpg')
        .add('chara_d', 'https://pixijs.io/examples/examples/assets/eggHead.png')
        .load().onComplete.add(() => {
            this.stage = $stage.initialize(); // replace stage by PIXI.display.Stage
            $camera.initialize();
        });
    };
}; 
let $app = new _app();
console.log('$app',$app); 


/** @extends PIXI.display.Stage */
class _stage extends PIXI.display.Stage {
    constructor() {
        super();
        this.scene = null;
    };
    
    /** setup a scene => background */
    initialize(){
        this.addChild($camera.view);
        this.createScene();
        this.create_grids();
        for (let i=0, l=10; i<l; i++) {
            const x = ~~(Math.random()*2000)-1000;
            const z = ~~(Math.random()*600)-300;
            const chara = this.createChara(x,0,z,i);
            this.extrude(chara);
        };
        this.createDebugAxis(this.scene.bg);
        this.createMouseCoor();
        return this;
    };

    /** create scene + [background,wall] */
    createScene(){
        const scene = this.scene = new PIXI.projection.Container3d();
        const bg = new PIXI.projection.Sprite3d($app.loader.resources.plane.texture);
        scene.bg = bg;
        bg.anchor.set(0.5);
        bg.euler.x = Math.PI / 2;
        const wall = new PIXI.projection.Sprite3d($app.loader.resources.plane.texture);
        scene.wall = wall;
        wall.anchor.set(0.5);
        wall.euler.x = 0;
        wall.position3d.y = -340;
        wall.position3d.z = 340;
        scene.addChild(bg,wall);
        this.scene = scene;
    };

    /**create the charactere in 3d space */
    createChara(x=0,y=0,z=0,id){
        const c = new PIXI.projection.Container3d()
        const bunny_d = c.d = new PIXI.projection.Sprite3d($app.loader.resources.chara_d.texture);
        bunny_d.anchor.set(0.5,1);
        c.addChild(bunny_d);
        c.position3d.set(x,y,z);
        this.scene.addChildAt(c,2);
        const txtID = new PIXI.Text(id,{ fill: "white", fontSize: 34,strokeThickness: 8 });
        txtID.anchor.set(3.7, 1);
        c.addChild(txtID);
        c.id = id;
        return c;
    };

    extrude(chara){
        chara.scale3d.z = 30;
    for (let i=0, l=EXTERUDQuality; i<l; i++) {
        const extrudSprite = new PIXI.projection.Sprite3d($app.loader.resources.chara_d.texture);
        extrudSprite.anchor.set(0.5,1);
        extrudSprite.position3d.set(0,0,i*0.01)
        extrudSprite.tint = i===l-1?0xffffff:0x000000;
        EXTERUD.push(extrudSprite);
        chara.addChild(extrudSprite);
    };
}

    /** get distance from 2 3d point */
    getDistanceFrom(t1,t2){
        const p1 = t1.position3d;
        const p2 = t2.position3d;
        const deltaX = p1.x - p2.x;
        const deltaY = p1.y - p2.y;
        const deltaZ = p1.z - p2.z;
        return {
            d:Math.sqrt( deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ ),
            a:-Math.atan2(p2.z - p1.z, p2.x - p1.x),
        }
    };
    /** NEED FORMULA TO DRAW 2D LINE BETWEEN Two 3D TARGET*/
    drawLineTo(from,to){
        // note: from have .euler.x : -Math.PI/2;
        from.removeChild(from.c)
        const c = new PIXI.projection.Container3d(); // need to be inside a container
        const fromXY = from.position3d;
        const toXY = to.position3d;
        const dist = this.getDistanceFrom(from,to);
        const line = new PIXI.Graphics();
        line.lineStyle(10, 0x4286f4, 1)
        .moveTo(0,0).bezierCurveTo(0, 100, dist.d, 100, dist.d, 0)//.lineTo(dist.d, 0)
        .endFill();
        const lineSprite = new PIXI.projection.Sprite3d ( $app.renderer.generateTexture( line,1,6 ) );
        lineSprite.rotation = dist.a; //!
        lineSprite.euler.x = -Math.PI/2;
        c.addChild(lineSprite);
        const txt = new PIXI.Text(`Dist: ~${dist.d.toFixed(2)}`,{fill:"white"})
        txt.anchor.set(0.5);
        txt.scale.set(1,-1);
        txt.position.set(dist.d/2,100);
        lineSprite.addChild(txt);
        from.addChild(c);
        from.c = c;
    };

    // just draw a grid for visual help
    create_grids(){
        const color = [0xffffff,0x000000,0xff0000,0x0000ff,0xffd800,0xcb42f4][~~(Math.random()*6)];
        const gridSize = 48;
        const [w,h] = [this.scene.bg.width,this.scene.bg.height];
        const grids = new PIXI.Graphics();
        grids.lineStyle(1, color, 1);
        // Vertical line
        for (let i=0, l=w/48; i<l; i++) {
            grids.lineStyle(1, 0xFFFFFF, 1).moveTo(i*48,0).lineTo(i*48, h)
        };
        for (let i=0, l=h/48; i<l; i++) {
            grids.moveTo(0,i*48).lineTo(h, i*48)
        };
        // draw center
        grids.lineStyle(2, 0xee82ff, 1).moveTo(w/2,0).lineTo(w/2, h).moveTo(0,h/2).lineTo(w, h/2);
        grids.endFill();
        const sprite = new PIXI.projection.Sprite3d( $app.renderer.generateTexture(grids) );
        sprite.alpha = 0.4;
        sprite.anchor.set(0.5);
        this.scene.bg.addChild(sprite);
    };

    /** add debug mouse coord from background */
    createMouseCoor(){
        const C = new PIXI.Container();
        const [coorX,coorY] = [
            new PIXI.Text("",{fontSize:20,strokeThickness:2,stroke:0x000000}),
            new PIXI.Text("",{fontSize:20,strokeThickness:2,stroke:0x000000}),
            ];
        const point = new PIXI.Sprite(PIXI.Texture.WHITE);
        point.anchor.set(0.5);
        [coorX.x,coorY.x] = [16,80];
        C.addChild(coorX,coorY,point);
        $stage.addChild(C);
        console.log($app.renderer.plugins.interaction);
        $app.ticker.add(function(){
            C.position.set(this.mouse.global.x,this.mouse.global.y);
            let pos = this.mouse.getLocalPosition($stage.scene.bg, new PIXI.Point(), this.mouse.global);
            let inX = Math.abs(~~pos.x)>$stage.scene.bg.width/2?"#ff0000":"#ffffff";
            let inZ = Math.abs(~~pos.y)>$stage.scene.bg.height/2?"#ff0000":"#ffffff";
            coorX.style.fill = inX;
            coorY.style.fill = inZ;
            coorX.text = `x:${~~pos.x}`;
            coorY.text = `z:${~~pos.y}`;
        },$app.renderer.plugins.interaction);
    };

    /** create a debug Axis for a target elements */
    createDebugAxis(target){
        const [w,h] = [target.width,target.height];
        function drawLine(from,to,color,txt){
            const line = new PIXI.Graphics();
            line.beginFill().lineStyle(4, color, 0.5);
            line.moveTo(from[0], from[1]).lineTo(to[0],to[1]).endFill();
            line.endFill();
            const t = new PIXI.Text(txt,{fill:0xffffff});
            line.addChild(t)
            return line;
        };
        const lineZ = new PIXI.projection.Sprite3d ( $app.renderer.generateTexture( drawLine( [0,0],[0,-h/2],0xf44242,'z' ) ) );
        const lineX = new PIXI.projection.Sprite3d ( $app.renderer.generateTexture( drawLine( [0,0],[-w/2,0],0x06d328,'x' ) ) );
        const lineY = new PIXI.projection.Sprite3d ( $app.renderer.generateTexture( drawLine( [0,0],[0,-h/2],0x0540d2,'y' ) ) );
        lineZ.euler.x = -Math.PI/2;
        target.addChild(lineZ,lineX,lineY);
    };

};
let $stage = new _stage();
console.log('$stage',$stage);
 
/**@class camera is objet data, Camera3d is in view*/
class _camera {
    constructor() {
        this.view = new PIXI.projection.Camera3d();
        this.view.position3d.set(100,-100,200)
        this.renderable = 1;
        this._screenW = $app.screen.width;
        this._screenH = $app.screen.height;
        this._sceneW = 0; // scene width
        this._sceneH = 0; // scene height
        this._zoom = 1.0; //current zoom factor, default is 1
        this._x_ang = -0.3;
        this._y_ang = -0.8;
        this._z_ang = 0.0;
        this._orthographic = true;
        this._culling = false;
    
        // camera hack
        this._focus = 4000;
        this._near = 10000;
        this._far = 10000;

        this._count = 0;
    };
 
    get scene(){
        return $stage.scene;
    };

    initialize(scene = this.scene){
        this._sceneW = scene.bg.width;
        this._sceneH = scene.bg.height;
        this.view.addChild(scene);
        this.view.position.set(this._screenW / 2, this._screenH / 2);
        this.view.setPlanes(this._focus, this._near, this._far, this._orthographic);
        this.debug();
        $app.ticker.add(this.update,this);
    };

    update(){
        this.view.scale3d.set(this._zoom);
        this.view.euler.y = this._y_ang;
        this.view.euler.x = this._x_ang;
        this.view.euler.z = this._z_ang;
        // this.view.updateTransform();
        //FIXME
        this._count = 0;
        for (let i=1, children = $stage.scene.children, l=children.length; i<l; i++) {
            const container = children[i];
            const bounds = container.getBounds(true);
            container.renderable = bounds.x+bounds.width >= 0 && 
            bounds.y+bounds.height>=0 && 
            bounds.x-bounds.width <= this._screenW && 
            bounds.y-bounds.height*2 <= this._screenH ;
            if (container.renderable === false) this._count++
            if(!this._culling){ // checkBox for disable culling
                container.renderable = true;
                this._count = 0;
            }
        };
    };

    debug(){
        // draw line
        const line = new PIXI.Graphics();
        const [sW,sH] = [this._screenW,this._screenH];
        PIXI.ticker.shared.add(() => {
            line.clear()
            line.lineStyle(1,0xffffff,0.6).moveTo(sW/2,0).lineTo(sW/2, sH).endFill(); //Vertical line Y
            line.lineStyle(1,0xffffff,0.6).moveTo(0,sH/2).lineTo(sW, sH/2).endFill(); // Horizon line X
        });
        $app.stage.addChild(line);

        const count = new PIXI.Text('0',{fill:0xffffff});
        count.position.set(599,20)
        $app.stage.addChild(count);

        PIXI.ticker.shared.add(()=> {
            count.text = 'culling: '+this._count;
        })
        // debug data custom div camera position
        const div = document.createElement("div");
        div.setAttribute("id", "camera");
        div.style.position = "absolute";
        div.style.top = "0px";
        div.style.left = "0px";
        div.style.opacity = 0.95;
        document.body.appendChild(div);
        // gui
        const gui = this._debug = new dat.GUI({ autoPlace: false, name:'CAMERA', closeOnTop:true });
        const f1 = gui.addFolder('SCREEN INFORMATION');
        f1.closed = true;
        f1.add(this, '_screenW').domElement.style.pointerEvents = "none";
        f1.add(this, '_screenH').domElement.style.pointerEvents = "none";
        f1.add(this, '_sceneW' ).domElement.style.pointerEvents = "none";
        f1.add(this, '_sceneH' ).domElement.style.pointerEvents = "none";
        f1.add(this.view.position, 'x' ).name('.Camera3d.x').domElement.style.pointerEvents = "none";
        f1.add(this.view.position, 'y' ).name('.Camera3d.y').domElement.style.pointerEvents = "none";
        const f2 = gui.addFolder('CAMERA');
        f2.closed = false;
        let onChangeCamera = ()=>{ 
            this.view.setPlanes(this._focus, this._near, this._far, this._orthographic);
        };
        f2.add(this, '_orthographic').listen().onChange(onChangeCamera);
        f2.add(this, '_culling').listen();
        f2.add(this.view.position3d, 'x').name('.position3d.x').step(1).listen();
        f2.add(this.view.position3d, 'y').name('.position3d.y').step(1).listen();
        f2.add(this.view.position3d, 'z').name('.position3d.z').step(1).listen();
        f2.add(this, '_x_ang').min(-Math.PI).max(Math.PI).step(0.001).listen();
        f2.add(this, '_y_ang').min(-Math.PI).max(Math.PI).step(0.001).listen();
        f2.add(this, '_z_ang').min(-Math.PI).max(Math.PI).step(0.001).listen();
        f2.add(this, '_zoom').min(0.2).max(4).step(0.00000001).listen();
        const f3 = gui.addFolder('culling');
        f3.closed = false;
        CHARA.forEach(sprite => {
            f3.add(sprite, 'renderable').listen().name('renderableID:'+sprite.id);
        });

        document.getElementById("camera").appendChild(gui.domElement);
    };
};
let $camera = new _camera();
console.log('$camera',$camera);