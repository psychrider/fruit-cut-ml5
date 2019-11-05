let video;
let nosex =0;
let nosey =0;
let leyex = 0;
let leyey = 0;
let d =0 ;
let D = 0;
let count = 0;
let rwristx = 0;
let rwristy = 0;
let Poses = [];//for skeleton function

let options =  {
  architecture: 'MobileNetV1',
  imageScaleFactor: 0.3,
  outputStride: 16,
  flipHorizontal: false,
  minConfidence: 0.5,
  maxPoseDetections: 5,
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: 'multiple',
  inputResolution: 513,
  multiplier: 0.75,
  quantBytes: 2
}

//runs only once
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);//captureing the vid
  video.hide();
  poseNet = ml5.poseNet(video,options, modelReady);//fires modelReady when model is ready
  poseNet.on('pose', gotPoses);
}

function modelReady(){
  console.log("Model Ready");
} 

function gotPoses(poses){
  //console.log(poses)
  Poses = poses;
  if(poses.length > 0){
    let nx = poses[0].pose.keypoints[0].position.x;
    let ny = poses[0].pose.keypoints[0].position.y;
    let elx = poses[0].pose.keypoints[1].position.x;
    let ely = poses[0].pose.keypoints[1].position.y;
    nosex = lerp(nosex,nx,0.5);//linear interpolation
    nosey = lerp(nosey,ny,0.5);
    leyex = lerp(leyex,elx,0.5);
    leyey = lerp(leyey,ely,0.5);
    // rwristx = poses[0].pose.keypoints[10].position.x;//right wrist
    // rwristy = poses[0].pose.keypoints[10].position.y;
    d = dist(nosex,nosey,leyex,leyey);
    count+=1;
    if(count == 5){D=d;}
    console.log("D is :"+D);
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < Poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = Poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(0, 0, 0);
        strokeWeight(2);
        stroke(230,230,255);
        ellipse(keypoint.position.x, keypoint.position.y, 5, 5);
        //drawing sword in the right hand
        if(pose.keypoints[10].score > 0.2){
          rwristx = pose.keypoints[10].position.x;//right wrist x coordinate
          rwristy = pose.keypoints[10].position.y;
          stroke(100,100,100);
          fill(200);
          rect(rwristx,rwristy-100,15,150,30,30,1,1);
        }

      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < Poses.length; i++) {
    let skeleton = Poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      strokeWeight(4);
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

//loops over and over
function draw() {
  //the image
  image(video, 0, 0);
  //skeleton
  drawKeypoints();
  drawSkeleton();
  //the joker nose
  stroke(175,0,0)
  fill(255,0,0);
  ellipse(nosex,nosey,d,d);  
}