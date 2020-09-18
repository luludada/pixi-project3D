//GLOBAL FOR EASY DEBUG
let CHARA = null;
let EXTERUD = [];
let EXTERUDQuality = 100;



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
        .add('chara_m', "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVja3kAAQAEAAAAPAAA/+EDK2h0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo5RDRFRDZBRDhDMkYxMUU5QkVCNzg1NzQ5QjM4NjE1QyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5RDRFRDZBQzhDMkYxMUU5QkVCNzg1NzQ5QjM4NjE1QyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjAxMjVGNkFDMkM0OTExRTJCQUM2RjEzMDg4MkQyOTkzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjAxMjVGNkFEMkM0OTExRTJCQUM2RjEzMDg4MkQyOTkzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABgQEBAUEBgUFBgkGBQYJCwgGBggLDAoKCwoK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")
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
        const chara = this.createChara(0,0,0);   
        this.extrude(chara);
        this.createDebugAxis(this.scene.bg);
        return this;
    };

    /** create scene + [background,wall] */
    createScene(){
        const scene = this.scene = new PIXI.projection.Container3d();
        const bg = new PIXI.projection.Sprite3d($app.loader.resources.plane.texture);
        scene.bg = bg;
        bg.anchor.set(0.5);
        bg.euler.x = Math.PI / 2;
        scene.addChild(bg);
        this.scene = scene;
    };

    /**create the charactere in 3d space */
    createChara(x=0,y=0,z=0,id){
        const c = new PIXI.projection.Container3d()
        const bunny_d = c.d = new PIXI.projection.Sprite3d($app.loader.resources.chara_d.texture);
        bunny_d.anchor.set(0.5,1);
        c.addChild(bunny_d);
        c.position3d.set(x,y,z);
        CHARA = c ;
        this.scene.addChild(c);
        return c;
    };

    extrude(chara){
            chara.scale3d.z = 50;
        for (let i=0, l=EXTERUDQuality; i<l; i++) {
            const extrudSprite = new PIXI.projection.Sprite3d($app.loader.resources.chara_d.texture);
            extrudSprite.anchor.set(0.5,1);
            extrudSprite.position3d.set(0,0,i*0.01)
            extrudSprite.tint = i===l-1?0xffffff:0x000000;
            EXTERUD.push(extrudSprite);
            chara.addChild(extrudSprite);
        };
    }

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
        this.view.position3d.set(25,0,140)
        this.renderable = 1;
        this._screenW = $app.screen.width;
        this._screenH = $app.screen.height;
        this._sceneW = 0; // scene width
        this._sceneH = 0; // scene height
        this._zoom = 1.2; //current zoom factor
        this._ang = -Math.PI+1;
        this._orthographic = false;
        this._perspective = -0.3;
        this._culling = true;
        this._extrudColor = true;
        // camera hack
        this._focus = 2800;
        this._near = 10000;
        this._far = 10000;
        
        this._count = 0

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
        this.view.euler.y = this._ang;
        this.view.euler.x = this._perspective;
        this.view.updateTransform();
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
        let onChangeExtrucColor = (value)=>{ 
            for (let i=0, l=EXTERUD.length; i<l; i++) {
                // EXTERUD[i].tint = (value||i===l-1)?0xffffff:0x000000;
            };
        };
        f2.add(CHARA.scale3d, 'z' ).name('.scale3d.z')
        f2.add(this, '_extrudColor').listen().onChange(onChangeExtrucColor);
        f2.add(this, '_ang').min(-Math.PI).max(Math.PI).step(0.01).listen();
        f2.add(this, '_zoom').min(0.1).max(4).step(0.00000001).listen();
  
        document.getElementById("camera").appendChild(gui.domElement);
    };
};
let $camera = new _camera();
console.log('$camera',$camera);