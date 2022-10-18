
// document.body.style.zoom="80%";
let sketch = function(p){
  
  let canvas;
  let dMouse = [];
  let closest = 0;
  let isEditMode = false;

  let fill_H_Slider, fill_S_Slider, fill_B_Slider, fill_O_Slider;
  let fill_H_Value, fill_S_Value, fill_B_Value, fill_O_Value;
  let stroke_H_Slider, stroke_S_Slider, stroke_B_Slider, stroke_O_Slider;
  let stroke_H_Value, stroke_S_Value, stroke_B_Value, stroke_O_Value;
  
  // let edit_button, undo_button, delete_button, complete_button;
  // let screenshot_button, save;
 
  let download=document.getElementById("download");
  let edit=document.getElementById("edit");
  let comp=document.getElementById("complete");
  let del=document.getElementById("delete");
  let undo=document.getElementById("undo");
  let fox=document.getElementById("fox");
  let ghost=document.getElementById("ghost");
  let clown =document.getElementById("clown");
  let pumpkin=document.getElementById("pumpkin");
  let opera=document.getElementById("opera");
  let opera2=document.getElementById("opera2");
  let grey=document.getElementById("grey");
  let shapes = [{
    fill_H : p.random(360),
    fill_S : 50,
    fill_B : 100,
    fill_O : 100,
    stroke_H : p.random(360),
    stroke_S : 50,
    stroke_B : 100,
    stroke_O : 100,
    indices : []
  }];

  let shapeIndex = 0;

  let tParameters;

  let capture;
  let shapesData;
  
  p.preload=function(){
    //  foxd=p.loadJSON("drawings/fox.json");
    //  ghostd=p.loadJSON("drawings/ghost.json");
    //  clownd=p.loadJSON("drawings/clown.json");
    //  greyd=p.loadJSON("drawings/grey.json");
    //  pumpd=p.loadJSON("drawings/pumpkin.json");
    //  operad=p.loadJSON("drawings/opera.json");
    //  opera2d=p.loadJSON("drawings/opera2.json");
  }
  p.setup = function(){
    canvas = p.createCanvas(640, 480);
    canvas.id('canvas');
    p.colorMode(p.HSB, 360, 100, 100, 100);
    
    
    shapeIndex=shapes.length-1;
    fill_H_Value = p.createDiv();
    fill_H_Value.class('valueDisplay');
    fill_H_Slider = p.createSlider(0, 360, p.random(360), 5);
    fill_H_Slider.class('Slider');

    fill_S_Value = p.createDiv();
    fill_S_Value.class('valueDisplay');
    fill_S_Slider = p.createSlider(0, 100, 50, 5);
    fill_S_Slider.class('Slider');

    fill_B_Value = p.createDiv();
    fill_B_Value.class('valueDisplay');
    fill_B_Slider = p.createSlider(0, 100, 100, 5);
    fill_B_Slider.class('Slider');

    fill_O_Value = p.createDiv();
    fill_O_Value.class('valueDisplay');
    fill_O_Slider = p.createSlider(0, 100, 100, 5);
    fill_O_Slider.class('Slider');

    stroke_H_Value = p.createDiv();
    stroke_H_Value.class('valueDisplay');
    stroke_H_Slider = p.createSlider(0, 360, p.random(360), 5);
    stroke_H_Slider.class('Slider');

    stroke_S_Value = p.createDiv();
    stroke_S_Value.class('valueDisplay');
    stroke_S_Slider = p.createSlider(0, 100, 50, 5);
    stroke_S_Slider.class('Slider');

    stroke_B_Value = p.createDiv();
    stroke_B_Value.class('valueDisplay');
    stroke_B_Slider = p.createSlider(0, 100, 100, 5);
    stroke_B_Slider.class('Slider');

    stroke_O_Value = p.createDiv();
    stroke_O_Value.class('valueDisplay');
    stroke_O_Slider = p.createSlider(0, 100, 100, 5);
    stroke_O_Slider.class('Slider');
    del.addEventListener('click',p.deleteDrawing);
    edit.addEventListener('click',p.toggleEdit);
    comp.addEventListener('click',p.complete);
    undo.addEventListener('click',p.undo);
    ghost.addEventListener('click',p.ghost);
    clown.addEventListener('click',p.clown);
    grey.addEventListener('click',p.grey);
    pumpkin.addEventListener('click',p.pumpkin);
    opera.addEventListener('click',p.opera);
    opera2.addEventListener('click',p.opera2);
    fox.addEventListener('click',p.fox);
    download.onclick =p.screenShot;
    
    // screenshot_button = p.createButton("Take SS");
    // screenshot_button.mousePressed(p.screenShot);
    // screenshot_button.class("imageButtons");
    // screenshot_button.id("screenshot_button");
    
    // complete_button = p.createButton("complete");
    // complete_button.mousePressed(p.complete);
    // complete_button.class("Buttons");
    // complete_button.id("complete_button");

    // undo_button = p.createButton("undo");
    // undo_button.mousePressed(p.undo);
    // undo_button.class("Buttons");
    // undo_button.id("undo_button");

    // edit_button = p.createButton("Edit mode off");
    // edit_button.mousePressed(p.toggleEdit);
    // edit_button.class("Buttons");
    // edit_button.id("edit_button");

    // delete_button = p.createButton("delete");
    // delete_button.mousePressed(p.deleteDrawing);
    // delete_button.class("Buttons");
    // delete_button.id("delete_button");
    

    tParameters = {
      fill_H : fill_H_Slider.value(),
      fill_S : fill_S_Slider.value(),
      fill_B : fill_B_Slider.value(),
      fill_O : fill_O_Slider.value(),
      stroke_H : stroke_H_Slider.value(),
      stroke_S : stroke_S_Slider.value(),
      stroke_B : stroke_B_Slider.value(),
      stroke_O : stroke_O_Slider.value()
    }

    capture = p.createCapture(p.VIDEO);
    capture.size(p.width, p.height);
    capture.hide();
  }

  p.draw = function(){
    p.clear();
    if(detections != undefined){
      if(detections.multiFaceLandmarks != undefined && detections.multiFaceLandmarks.length >= 1){
        p.drawShapes();
        if(isEditMode == true){
          p.faceMesh();
          p.editShapes();
        }
        p.glow();
      }
    }

    fill_H_Value.html("fill hue: " + fill_H_Slider.value());
    fill_S_Value.html("fill saturation: " + fill_S_Slider.value());
    fill_B_Value.html("fill brightness: " + fill_B_Slider.value());
    fill_O_Value.html("fill opacity: " + fill_O_Slider.value());

    stroke_H_Value.html("stroke hue: " + stroke_H_Slider.value());
    stroke_S_Value.html("stroke saturation: " + stroke_S_Slider.value());
    stroke_B_Value.html("stroke brightness: " + stroke_B_Slider.value());
    stroke_O_Value.html("stroke opacity: " + stroke_O_Slider.value());
  }

  p.faceMesh = function(){
    p.stroke(255);
    p.strokeWeight(3);

    p.beginShape(p.POINTS);
    for(let i=0; i<detections.multiFaceLandmarks[0].length; i++){
      let x = detections.multiFaceLandmarks[0][i].x * p.width;
      let y = detections.multiFaceLandmarks[0][i].y * p.height;
      p.vertex(x, y);

      let d = p.dist(x, y, p.mouseX, p.mouseY);
      dMouse.push(d);
    }
    p.endShape();

    let minimum = p.min(dMouse);
    closest = dMouse.indexOf(minimum);

    p.stroke(0, 100, 100);
    p.strokeWeight(10);
    p.point(
      detections.multiFaceLandmarks[0][closest].x * p.width,
      detections.multiFaceLandmarks[0][closest].y * p.height
    );

    dMouse.splice(0, dMouse.length);
  }
  p.undo = function(){
    if(shapes[shapeIndex] != undefined){
      if(shapes[shapeIndex].indices.length > 0) shapes[shapeIndex].indices.pop();
    }
    console.log(shapes[shapeIndex].indices);
  }

   
  p.screenShot = function(){
    p.image(capture.get(0, 0, p.width, p.height), 0, 0, p.width, p.height);
    // p.faceMesh();
    p.drawShapes();
    p.glow();
    p.saveCanvas('screenShot', 'png');
  }
  p.toggleEdit = function(){
    isEditMode = !isEditMode;

    if(isEditMode == true){
      edit_button.html("Edit mode on");
    }else if(isEditMode == false){
      edit_button.html("Edit mode off");
    }
  }

  p.complete = function(){
    if(shapes[shapes.length-1].indices.length > 0){
      if(shapes[shapeIndex].indices.length == 0 && shapes.length > 1) shapes.splice(shapeIndex, 1);

      shapes.push(
        {
          fill_H : p.random(360),
          fill_S : 50,
          fill_B : 100,
          fill_O : 100,
          stroke_H : p.random(360),
          stroke_S : 50,
          stroke_B : 100,
          stroke_O : 100,
          indices : []
        }
      );
      shapeIndex = shapes.length-1;
    }
    console.log(shapes);
  }

  p.toggleEdit = function(){
    isEditMode = !isEditMode;

    if(isEditMode == true){
      edit_button.html("Edit mode on");
    }else if(isEditMode == false){
      edit_button.html("Edit mode off");
    }
  }
  p.ghost=function(){
    let q=JSON.stringify(gh);
    let j=JSON.parse(q);
    shapes=j.shapes;
    
  }
  p.clown=function(){
    let q=JSON.stringify(clownd);
    let j=JSON.parse(q);
    shapes=j.shapes;
  }
  p.grey=function(){
    let q=JSON.stringify(greyd);
    let j=JSON.parse(q);
    shapes=j.shapes;
  }
  p.fox=function(){
    let q=JSON.stringify(foxd);
    let j=JSON.parse(q);
    shapes=j.shapes;
  }
  p.pumpkin=function(){
    let q=JSON.stringify(pumpkind);
    let j=JSON.parse(q);
    shapes=j.shapes;
  }
  p.opera=function(){
    let q=JSON.stringify(operad);
    let j=JSON.parse(q);
    shapes=j.shapes;
  }
  p.opera2=function(){
    let q=JSON.stringify(opera2d);
    let j=JSON.parse(q);
    shapes=j.shapes;
  }
  p.deleteDrawing = function(){
   
    shapes = [
      {
        fill_H : p.random(360),
        fill_S : 50,
        fill_B : 100,
        fill_O : 100,
        stroke_H : p.random(360),
        stroke_S : 50,
        stroke_B : 100,
        stroke_O : 100,
        indices : []
      }
    ];
    shapeIndex = 0;
    console.log(shapes);
  }



  p.mouseClicked = function(){
    if(p.mouseX >= 0 && p.mouseX <= p.width){
      if(p.mouseY >= 0 && p.mouseY <= p.height){
        if(isEditMode == true){
          shapes[shapeIndex].indices.push(closest);
          console.log(shapes);
        }
      }
    }
  }

  p.drawShapes = function(){
    for(let s = 0; s < shapes.length; s++){
      p.fill(
        shapes[s].fill_H,
        shapes[s].fill_S,
        shapes[s].fill_B,
        shapes[s].fill_O
      );
      p.stroke(
        shapes[s].stroke_H,
        shapes[s].stroke_S,
        shapes[s].stroke_B,
        shapes[s].stroke_O
      );
      p.strokeWeight(3);

      if(isEditMode == true){
        if(s == shapeIndex) p.glow('rgba(255, 255, 255, 100)');
        else p.glow('rgba(255, 255, 255, 0)');
      }else if(isEditMode == false){
        p.glow('rgba(255, 255, 255, 100)');
      }

      p.beginShape();
        for(let i = 0; i < shapes[s].indices.length; i++){
          p.vertex(
            detections.multiFaceLandmarks[0][shapes[s].indices[i]].x * p.width,
            detections.multiFaceLandmarks[0][shapes[s].indices[i]].y * p.height,
          );
        }
      p.endShape();
    }
  }

  p.editShapes = function(){
    // --- fill ---
    if(tParameters.fill_H != fill_H_Slider.value()){
      tParameters.fill_H = fill_H_Slider.value();
      shapes[shapeIndex].fill_H = fill_H_Slider.value();
    }
    if(tParameters.fill_S!= fill_S_Slider.value()){
      tParameters.fill_S = fill_S_Slider.value();
      shapes[shapeIndex].fill_S = fill_S_Slider.value();
    }
    if(tParameters.fill_B != fill_B_Slider.value()){
      tParameters.fill_B = fill_B_Slider.value();
      shapes[shapeIndex].fill_B = fill_B_Slider.value();
    }
    if(tParameters.fill_O != fill_O_Slider.value()){
      tParameters.fill_O = fill_O_Slider.value();
      shapes[shapeIndex].fill_O = fill_O_Slider.value();
    }

    // --- stroke ---
    if(tParameters.stroke_H != stroke_H_Slider.value()){
      tParameters.stroke_H = stroke_H_Slider.value();
      shapes[shapeIndex].stroke_H = stroke_H_Slider.value();
    }
    if(tParameters.stroke_S != stroke_S_Slider.value()){
      tParameters.stroke_S = stroke_S_Slider.value();
      shapes[shapeIndex].stroke_S = stroke_S_Slider.value();
    }
    if(tParameters.stroke_B != stroke_B_Slider.value()){
      tParameters.stroke_B = stroke_B_Slider.value();
      shapes[shapeIndex].stroke_B = stroke_B_Slider.value();
    }
    if(tParameters.stroke_O != stroke_O_Slider.value()){
      tParameters.stroke_O = stroke_O_Slider.value();
      shapes[shapeIndex].stroke_O = stroke_O_Slider.value();
    }
  }

  p.keyTyped = function(){
    if(p.key === 'e') isEditMode = !isEditMode;

    if(p.key === 'c'){
      if(shapes[shapes.length-1].indices.length > 0){
        shapes.push(
          {
            fill_H : p.random(360),
            fill_S : 50,
            fill_B : 100,
            fill_O : 100,
            stroke_H : p.random(360),
            stroke_S : 50,
            stroke_B : 100,
            stroke_O : 100,
            indices : []
          }
        );
        shapeIndex = shapes.length-1;
      }
      console.log(shapes);
    }

    if(p.key === 'z'){
      if(shapes[shapeIndex] != undefined){
        if(shapes[shapeIndex].indices.length > 0) shapes[shapeIndex].indices.pop();
      }
      console.log(shapes[shapeIndex].indices);
    }

    if(p.key === 'd'){
      shapes = [
        {
          fill_H : p.random(360),
          fill_S : 50,
          fill_B : 100,
          fill_O : 100,
          stroke_H : p.random(360),
          stroke_S : 50,
          stroke_B : 100,
          stroke_O : 100,
          indices : []
        }
      ];
      shapeIndex = 0;
      console.log(shapes);
    }

    if(p.key === 's'){
      p.image(capture.get(0, 0, p.width, p.height), 0, 0, p.width, p.height);
      p.drawShapes();
      p.glow();
      p.saveCanvas('screenShot', 'png');
    }
  }

  p.keyPressed = function(){
    if(p.keyCode === p.UP_ARROW){
      if(shapes[shapeIndex] != undefined){
        if(shapes[shapeIndex].indices.length == 0 && shapes.length > 1) shapes.splice(shapeIndex, 1);
        if(shapeIndex < shapes.length-1) shapeIndex++;
      }
    } else if(p.keyCode === p.DOWN_ARROW){
      if(shapes[shapeIndex] != undefined){
        if(shapes[shapeIndex].indices.length == 0 && shapes.length > 1) shapes.splice(shapeIndex, 1);
        if(shapeIndex > 0) shapeIndex--;
      }
    }
    console.log(shapeIndex);
  }

  p.glow = function(glowColor){
    p.drawingContext.shadowOffsetX = 0;
    p.drawingContext.shadowOffsetY = 0;
    p.drawingContext.shadowBlur = 20;
    p.drawingContext.shadowColor = glowColor;
  }
}

let myp5 = new p5(sketch);

let gh={
  "shapes": [
    {
      "fill_H": 225,
      "fill_S": 5,
      "fill_B": 100,
      "fill_O": 100,
      "stroke_H": 255,
      "stroke_S": 50,
      "stroke_B": 100,
      "stroke_O": 100,
      "indices": [
        152,
        148,
        176,
        149,
        150,
        136,
        172,
        58,
        132,
        93,
        234,
        127,
        162,
        21,
        54,
        103,
        67,
        109,
        10,
        338,
        297,
        332,
        284,
        251,
        389,
        356,
        454,
        323,
        361,
        288,
        397,
        365,
        379,
        378,
        400,
        377,
        152
      ]
    },
    {
      "fill_H": 360,
      "fill_S": 45,
      "fill_B": 100,
      "fill_O": 100,
      "stroke_H": 255,
      "stroke_S": 50,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": [
        73,
        180,
        84,
        17,
        314,
        404,
        303,
        312,
        82,
        73,
        288
      ]
    },
    {
      "fill_H": 360,
      "fill_S": 45,
      "fill_B": 100,
      "fill_O": 100,
      "stroke_H": 360,
      "stroke_S": 60,
      "stroke_B": 100,
      "stroke_O": 100,
      "indices": [
        13,
        17
      ]
    },
    {
      "fill_H": 360,
      "fill_S": 45,
      "fill_B": 100,
      "fill_O": 0,
      "stroke_H": 265,
      "stroke_S": 50,
      "stroke_B": 100,
      "stroke_O": 100,
      "indices": [
        92,
        73,
        82,
        13,
        312,
        303,
        322
      ]
    },
    {
      "fill_H": 345,
      "fill_S": 50,
      "fill_B": 100,
      "fill_O": 100,
      "stroke_H": 130,
      "stroke_S": 50,
      "stroke_B": 0,
      "stroke_O": 100,
      "indices": [
        225,
        100
      ]
    },
    {
      "fill_H": 345,
      "fill_S": 50,
      "fill_B": 100,
      "fill_O": 100,
      "stroke_H": 130,
      "stroke_S": 50,
      "stroke_B": 0,
      "stroke_O": 100,
      "indices": [
        221,
        117
      ]
    },
    {
      "fill_H": 345,
      "fill_S": 50,
      "fill_B": 100,
      "fill_O": 0,
      "stroke_H": 130,
      "stroke_S": 50,
      "stroke_B": 0,
      "stroke_O": 100,
      "indices": [
        453,
        452,
        451,
        450,
        449,
        448,
        261
      ]
    },
    {
      "fill_H": 360,
      "fill_S": 45,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 265,
      "stroke_S": 50,
      "stroke_B": 100,
      "stroke_O": 100,
      "indices": []
    }
  ]
}

let clownd={
  "shapes": [
    {
      "fill_H": 230,
      "fill_S": 0,
      "fill_B": 100,
      "fill_O": 100,
      "stroke_H": 25,
      "stroke_S": 0,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": [
        14,
        87,
        178,
        88,
        95,
        78,
        191,
        80,
        81,
        82,
        13,
        12,
        11,
        0,
        164,
        2,
        94,
        19,
        1,
        4,
        5,
        195,
        197,
        6,
        122,
        245,
        244,
        243,
        112,
        26,
        22,
        23,
        24,
        110,
        226,
        247,
        30,
        29,
        27,
        28,
        56,
        190,
        243,
        244,
        245,
        122,
        6,
        168,
        8,
        9,
        151,
        10,
        109,
        67,
        103,
        54,
        21,
        162,
        127,
        234,
        93,
        132,
        58,
        172,
        136,
        150,
        149,
        176,
        148,
        152,
        175,
        199,
        200,
        18,
        17,
        16,
        15,
        14
      ]
    },
    {
      "fill_H": 75,
      "fill_S": 0,
      "fill_B": 100,
      "fill_O": 100,
      "stroke_H": 0,
      "stroke_S": 0,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": [
        152,
        175,
        199,
        200,
        18,
        17,
        16,
        15,
        14,
        317,
        402,
        318,
        324,
        308,
        415,
        310,
        311,
        312,
        13,
        12,
        11,
        0,
        164,
        2,
        94,
        19,
        1,
        4,
        5,
        195,
        197,
        6,
        351,
        465,
        464,
        463,
        341,
        256,
        252,
        253,
        254,
        339,
        446,
        467,
        260,
        259,
        257,
        258,
        286,
        414,
        463,
        464,
        465,
        351,
        6,
        168,
        8,
        9,
        151,
        10,
        338,
        297,
        332,
        284,
        251,
        389,
        356,
        454,
        323,
        361,
        288,
        397,
        365,
        379,
        378,
        400,
        377,
        152,
        356
      ]
    },
    {
      "fill_H": 115,
      "fill_S": 50,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 0,
      "stroke_S": 50,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": [
        27,
        28,
        56,
        190,
        243,
        112,
        26,
        22,
        23,
        24,
        110,
        226,
        247,
        30,
        29,
        27,
        323
      ]
    },
    {
      "fill_H": 115,
      "fill_S": 50,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 0,
      "stroke_S": 50,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": [
        257,
        259,
        260,
        467,
        446,
        339,
        254,
        253,
        252,
        256,
        341,
        463,
        414,
        286,
        258,
        257
      ]
    },
    {
      "fill_H": 355,
      "fill_S": 70,
      "fill_B": 100,
      "fill_O": 100,
      "stroke_H": 0,
      "stroke_S": 50,
      "stroke_B": 0,
      "stroke_O": 0,
      "indices": [
        1,
        44,
        220,
        134,
        51,
        5,
        281,
        363,
        440,
        274,
        1
      ]
    },
    {
      "fill_H": 355,
      "fill_S": 0,
      "fill_B": 30,
      "fill_O": 100,
      "stroke_H": 0,
      "stroke_S": 50,
      "stroke_B": 0,
      "stroke_O": 0,
      "indices": [
        27,
        52,
        29,
        27
      ]
    },
    {
      "fill_H": 355,
      "fill_S": 0,
      "fill_B": 30,
      "fill_O": 100,
      "stroke_H": 0,
      "stroke_S": 50,
      "stroke_B": 0,
      "stroke_O": 0,
      "indices": [
        23,
        101,
        24,
        23
      ]
    },
    {
      "fill_H": 320,
      "fill_S": 0,
      "fill_B": 30,
      "fill_O": 100,
      "stroke_H": 235,
      "stroke_S": 50,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": [
        257,
        282,
        259,
        257
      ]
    },
    {
      "fill_H": 320,
      "fill_S": 0,
      "fill_B": 30,
      "fill_O": 100,
      "stroke_H": 235,
      "stroke_S": 50,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": [
        253,
        330,
        254,
        253
      ]
    },
    {
      "fill_H": 210,
      "fill_S": 0,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 170,
      "stroke_S": 0,
      "stroke_B": 0,
      "stroke_O": 100,
      "indices": [
        61,
        76,
        62,
        78,
        95,
        88,
        178,
        87,
        14,
        317,
        402,
        318,
        324,
        308,
        292,
        306,
        291,
        306,
        292,
        308,
        319,
        404,
        315,
        16,
        85,
        180,
        89,
        78,
        62,
        76,
        61
      ]
    },
    {
      "fill_H": 5,
      "fill_S": 0,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 50,
      "stroke_S": 50,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": [
        78,
        191,
        80,
        81,
        82,
        13,
        312,
        311,
        310,
        415,
        308,
        303,
        302,
        12,
        72,
        73,
        183,
        78,
        264
      ]
    },
    {
      "fill_H": 135,
      "fill_S": 50,
      "fill_B": 100,
      "fill_O": 0,
      "stroke_H": 40,
      "stroke_S": 0,
      "stroke_B": 70,
      "stroke_O": 100,
      "indices": [
        107,
        66,
        105,
        63,
        70
      ]
    },
    {
      "fill_H": 135,
      "fill_S": 50,
      "fill_B": 100,
      "fill_O": 0,
      "stroke_H": 40,
      "stroke_S": 0,
      "stroke_B": 70,
      "stroke_O": 100,
      "indices": [
        336,
        296,
        334,
        293,
        300
      ]
    },
    {
      "fill_H": 135,
      "fill_S": 50,
      "fill_B": 100,
      "fill_O": 0,
      "stroke_H": 40,
      "stroke_S": 0,
      "stroke_B": 70,
      "stroke_O": 100,
      "indices": []
    }
  ]
}
let greyd={
  "shapes": [
    {
      "fill_H": 160,
      "fill_S": 25,
      "fill_B": 100,
      "fill_O": 100,
      "stroke_H": 160,
      "stroke_S": 50,
      "stroke_B": 80,
      "stroke_O": 100,
      "indices": [
        152,
        170,
        138,
        177,
        93,
        234,
        127,
        162,
        21,
        54,
        103,
        67,
        109,
        10,
        338,
        297,
        332,
        284,
        251,
        389,
        356,
        454,
        323,
        401,
        367,
        395,
        152
      ]
    },
    {
      "fill_H": 160,
      "fill_S": 95,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 160,
      "stroke_S": 50,
      "stroke_B": 80,
      "stroke_O": 100,
      "indices": [
        142,
        101,
        118,
        31,
        226,
        113,
        225,
        224,
        223,
        222,
        221,
        189,
        245,
        217,
        209,
        142
      ]
    },
    {
      "fill_H": 160,
      "fill_S": 95,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 160,
      "stroke_S": 50,
      "stroke_B": 80,
      "stroke_O": 100,
      "indices": [
        429,
        437,
        465,
        413,
        441,
        442,
        443,
        444,
        445,
        342,
        446,
        261,
        347,
        330,
        371,
        429
      ]
    },
    {
      "fill_H": 160,
      "fill_S": 95,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 160,
      "stroke_S": 50,
      "stroke_B": 80,
      "stroke_O": 100,
      "indices": [
        89,
        81,
        38,
        12,
        268,
        311,
        319,
        89
      ]
    },
    {
      "fill_H": 160,
      "fill_S": 95,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 160,
      "stroke_S": 50,
      "stroke_B": 25,
      "stroke_O": 100,
      "indices": [
        60,
        60,
        97
      ]
    },
    {
      "fill_H": 160,
      "fill_S": 95,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 160,
      "stroke_S": 50,
      "stroke_B": 25,
      "stroke_O": 100,
      "indices": [
        290,
        328,
        326
      ]
    },
    {
      "fill_H": 160,
      "fill_S": 95,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 160,
      "stroke_S": 50,
      "stroke_B": 25,
      "stroke_O": 100,
      "indices": []
    }
  ]
}
let foxd={
  "shapes": [
    {
      "fill_H": 0,
      "fill_S": 0,
      "fill_B": 100,
      "fill_O": 100,
      "stroke_H": 0,
      "stroke_S": 0,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": [
        2,
        167,
        92,
        216,
        207,
        187,
        147,
        137,
        234,
        127,
        162,
        21,
        54,
        103,
        67,
        109,
        10,
        151,
        9,
        8,
        168,
        6,
        197,
        195,
        5,
        3,
        196,
        188,
        233,
        243,
        190,
        56,
        28,
        27,
        225,
        130,
        25,
        110,
        24,
        23,
        22,
        233,
        188,
        196,
        3,
        5,
        4,
        1,
        19,
        94,
        2
      ]
    },
    {
      "fill_H": 0,
      "fill_S": 0,
      "fill_B": 100,
      "fill_O": 100,
      "stroke_H": 0,
      "stroke_S": 0,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": [
        2,
        393,
        322,
        436,
        427,
        411,
        376,
        366,
        454,
        356,
        389,
        251,
        284,
        332,
        297,
        338,
        10,
        151,
        9,
        8,
        168,
        6,
        197,
        195,
        5,
        248,
        419,
        412,
        453,
        463,
        414,
        286,
        258,
        257,
        445,
        359,
        255,
        339,
        254,
        253,
        252,
        453,
        412,
        419,
        248,
        5,
        4,
        1,
        19,
        94,
        2
      ]
    },
    {
      "fill_H": 0,
      "fill_S": 100,
      "fill_B": 100,
      "fill_O": 100,
      "stroke_H": 130,
      "stroke_S": 100,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": [
        188,
        245,
        189,
        221,
        222,
        223,
        46,
        226,
        31,
        228,
        229,
        230,
        231,
        128,
        233,
        22,
        23,
        24,
        110,
        25,
        130,
        225,
        27,
        28,
        56,
        190,
        243,
        233,
        128,
        188
      ]
    },
    {
      "fill_H": 0,
      "fill_S": 100,
      "fill_B": 100,
      "fill_O": 100,
      "stroke_H": 0,
      "stroke_S": 100,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": [
        412,
        465,
        413,
        441,
        442,
        276,
        446,
        261,
        448,
        449,
        450,
        451,
        357,
        453,
        252,
        253,
        254,
        339,
        255,
        359,
        445,
        257,
        258,
        286,
        414,
        463,
        453,
        357,
        412
      ]
    },
    {
      "fill_H": 70,
      "fill_S": 50,
      "fill_B": 100,
      "fill_O": 0,
      "stroke_H": 0,
      "stroke_S": 0,
      "stroke_B": 30,
      "stroke_O": 100,
      "indices": [
        19,
        1,
        45,
        1,
        275
      ]
    },
    {
      "fill_H": 0,
      "fill_S": 100,
      "fill_B": 100,
      "fill_O": 0,
      "stroke_H": 0,
      "stroke_S": 100,
      "stroke_B": 100,
      "stroke_O": 100,
      "indices": [
        355,
        371,
        280,
        352
      ]
    },
    {
      "fill_H": 0,
      "fill_S": 100,
      "fill_B": 100,
      "fill_O": 0,
      "stroke_H": 0,
      "stroke_S": 100,
      "stroke_B": 100,
      "stroke_O": 100,
      "indices": [
        277,
        329,
        347,
        346,
        340
      ]
    },
    {
      "fill_H": 225,
      "fill_S": 50,
      "fill_B": 100,
      "fill_O": 0,
      "stroke_H": 0,
      "stroke_S": 100,
      "stroke_B": 100,
      "stroke_O": 100,
      "indices": [
        47,
        100,
        118,
        117,
        111
      ]
    },
    {
      "fill_H": 225,
      "fill_S": 50,
      "fill_B": 100,
      "fill_O": 0,
      "stroke_H": 0,
      "stroke_S": 100,
      "stroke_B": 100,
      "stroke_O": 100,
      "indices": [
        126,
        142,
        50,
        123
      ]
    },
    {
      "fill_H": 0,
      "fill_S": 100,
      "fill_B": 100,
      "fill_O": 100,
      "stroke_H": 0,
      "stroke_S": 100,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": [
        168,
        107,
        151,
        336,
        168,
        447
      ]
    },
    {
      "fill_H": 0,
      "fill_S": 100,
      "fill_B": 100,
      "fill_O": 100,
      "stroke_H": 0,
      "stroke_S": 100,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": []
    }
  ]
}
let pumpkind={
  "shapes": [
    {
      "fill_H": 40,
      "fill_S": 100,
      "fill_B": 90,
      "fill_O": 100,
      "stroke_H": 30,
      "stroke_S": 100,
      "stroke_B": 50,
      "stroke_O": 100,
      "indices": [
        10,
        338,
        297,
        332,
        284,
        251,
        389,
        356,
        454,
        323,
        361,
        288,
        397,
        365,
        379,
        378,
        400,
        377,
        152,
        148,
        176,
        149,
        150,
        136,
        172,
        58,
        132,
        93,
        234,
        127,
        162,
        21,
        54,
        103,
        67,
        109,
        10
      ]
    },
    {
      "fill_H": 40,
      "fill_S": 100,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 30,
      "stroke_S": 100,
      "stroke_B": 50,
      "stroke_O": 100,
      "indices": [
        6,
        6,
        294,
        64,
        6
      ]
    },
    {
      "fill_H": 40,
      "fill_S": 100,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 30,
      "stroke_S": 100,
      "stroke_B": 50,
      "stroke_O": 100,
      "indices": [
        31,
        65,
        233,
        31
      ]
    },
    {
      "fill_H": 40,
      "fill_S": 100,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 30,
      "stroke_S": 100,
      "stroke_B": 50,
      "stroke_O": 100,
      "indices": [
        465,
        258,
        265,
        253,
        465
      ]
    },
    {
      "fill_H": 40,
      "fill_S": 100,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 30,
      "stroke_S": 100,
      "stroke_B": 50,
      "stroke_O": 100,
      "indices": [
        0,
        312,
        302,
        311,
        303,
        310,
        270,
        409,
        291,
        375,
        320,
        324,
        404,
        402,
        315,
        14,
        85,
        178,
        180,
        88,
        91,
        95,
        146,
        61,
        185,
        40,
        42,
        39,
        81,
        37,
        82
      ]
    },
    {
      "fill_H": 40,
      "fill_S": 100,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 30,
      "stroke_S": 100,
      "stroke_B": 50,
      "stroke_O": 100,
      "indices": [
        397
      ]
    }
  ]
}
let operad={
  "shapes": [
    {
      "fill_H": 270,
      "fill_S": 0,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 285,
      "stroke_S": 50,
      "stroke_B": 100,
      "stroke_O": 100,
      "indices": [
        8,
        8,
        8,
        55,
        65,
        52,
        53,
        70,
        71,
        21,
        139,
        143,
        111,
        117,
        118,
        126,
        198,
        236,
        3,
        195,
        196,
        188,
        233,
        23,
        24,
        110,
        25,
        130,
        113,
        29,
        27,
        28,
        56,
        190,
        243,
        233,
        188,
        196,
        195
      ]
    },
    {
      "fill_H": 270,
      "fill_S": 0,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 285,
      "stroke_S": 50,
      "stroke_B": 100,
      "stroke_O": 100,
      "indices": [
        8,
        285,
        295,
        282,
        283,
        300,
        301,
        251,
        368,
        372,
        340,
        346,
        347,
        355,
        420,
        456,
        248,
        195,
        419,
        412,
        453,
        253,
        254,
        339,
        255,
        359,
        342,
        259,
        257,
        258,
        286,
        414,
        463,
        453,
        412,
        419,
        195
      ]
    },
    {
      "fill_H": 270,
      "fill_S": 0,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 285,
      "stroke_S": 50,
      "stroke_B": 100,
      "stroke_O": 100,
      "indices": []
    }
  ]
}
let opera2d={
  "shapes": [
    {
      "fill_H": 155,
      "fill_S": 0,
      "fill_B": 100,
      "fill_O": 100,
      "stroke_H": 330,
      "stroke_S": 50,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": [
        150,
        150,
        212,
        216,
        206,
        98,
        97,
        2,
        462,
        250,
        459,
        440,
        363,
        456,
        399,
        412,
        465,
        413,
        441,
        442,
        443,
        444,
        445,
        342,
        265,
        372,
        264,
        389,
        251,
        284,
        332,
        297,
        338,
        10,
        109,
        67,
        103,
        54,
        21,
        162,
        127,
        34,
        143,
        35,
        226,
        113,
        225,
        224,
        223,
        222,
        221,
        189,
        244,
        233,
        232,
        231,
        230,
        229,
        228,
        31,
        226,
        35,
        143,
        34,
        127,
        234,
        93,
        132,
        58,
        172,
        136,
        150
      ]
    },
    {
      "fill_H": 155,
      "fill_S": 0,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 330,
      "stroke_S": 50,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": [
        389,
        356,
        454,
        323,
        361,
        288,
        397,
        365,
        379,
        378,
        400,
        377,
        152,
        148,
        176,
        149,
        150,
        212,
        216,
        206,
        98,
        97,
        2,
        164,
        0,
        11,
        12,
        13,
        82,
        81,
        80,
        191,
        78,
        95,
        88,
        178,
        87,
        14,
        317,
        402,
        318,
        324,
        308,
        415,
        310,
        311,
        312,
        13,
        12,
        11,
        0,
        164,
        2,
        250,
        459,
        440,
        363,
        456,
        399,
        412,
        465,
        413,
        464,
        453,
        452,
        451,
        450,
        449,
        448,
        261,
        446,
        342,
        265,
        372,
        264,
        389,
        397
      ]
    },
    {
      "fill_H": 155,
      "fill_S": 0,
      "fill_B": 0,
      "fill_O": 100,
      "stroke_H": 330,
      "stroke_S": 50,
      "stroke_B": 100,
      "stroke_O": 0,
      "indices": []
    }
  ]
}

