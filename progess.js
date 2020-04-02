const imageURL = "https://drive.google.com/uc?export=view&id=1G8XzwzHjDpT-ZCE-wzEUN_dFxsSiK9kQ";

const CANVAS_SIZE = 450;

const LEVEL_DATA = [
  "1111111111111111",
  "1111111111111111",
  "1111111111001111",
  "1111111111111111",
  "1111011111111111",
  "1111111111111111",
  "1111111111111111",
  "1111111121111111",
  "1111111111111111",
  "1111111111111111",
  "1111000111111111",
  "1111111111111111",
  "1111111111111111",
  "1111111111111111",
  "1111111111111111",
  "1111111110000011"
];

let grid_data;
let head_pos = []; // [x, y]
let head_image;

let board_size, cell_size;

const ANIMATION_DURATION = 10;
let animate_timer = 0;
let velocity_to_next_pos;

let control_buttons = [];

function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  
  // set up head image
  head_image = createImg(imageURL, "head");
  head_image.hide();
  
  // set up sizing variables
  board_size = LEVEL_DATA.length;
  cell_size = CANVAS_SIZE / board_size;
  
  // set up grid_data
  grid_data = LEVEL_DATA.map(dataRow => dataRow.split(""));
  
  // set up head position
  for (let y=0; y < LEVEL_DATA.length; y++){
    let head_x = LEVEL_DATA[y].indexOf("2");
    // if found the head
    if (head_x !== -1){
      head_pos = [head_x, y];
      break;
    }
  }
  
  // set up buttons
  const velocities = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ];
  
  ["left", "right", "up", "down"].forEach(makeControl);
  
  function makeControl(direction, index){
    control_buttons[index] = createButton(direction);
    control_buttons[index].mousePressed(function(){
      startMoving(velocities[index]);
    });
  }
  
}

function getNextPos(velocity){
  return [
    head_pos[0] + velocity[0],
    head_pos[1] + velocity[1]
  ];
}

function startMoving(velocity){
  if (animate_timer > 0) return; // is currently moving, stops function
  
  let [next_x, next_y] = getNextPos(velocity);
  
  const x_in_bound = next_x >= 0 && next_x < board_size;
  const y_in_bound = next_y >= 0 && next_y < board_size;
  
  if (!(x_in_bound && y_in_bound)) return; // is out of bound, stops function
  
  if (grid_data[next_y][next_x] === "1"){
    velocity_to_next_pos = velocity;
    animate_timer = ANIMATION_DURATION;
  }
}

function updateMoving(){
  if (animate_timer > 0){
    animate_timer--; // counting down
    
    if (animate_timer === 0){
      stopMoving(); // when animate_timer countdown completed
    }
  }
}

function stopMoving(){
  head_pos = getNextPos(velocity_to_next_pos);
  grid_data[head_pos[1]][head_pos[0]] = "2";
  
  if (checkWin()) return console.log("you won!");
  
  startMoving(velocity_to_next_pos);
}

function checkWin(){
  return !grid_data.flat(1).includes("1");
}

function renderBoard(){
  for (let y=0; y < board_size; y++){
    for (let x=0; x < board_size; x++){
      let cell_data = grid_data[y][x];
      
      if (cell_data === "0") {
        continue; // don't render this position
      }
      else if (cell_data === "1"){
        fill(200); // white
      }
      else {
        fill(250, 115, 37); // orange
      }
      rect(x * cell_size, y * cell_size, cell_size, cell_size);
    }
  }
}

function renderHead(){
  if (animate_timer > 0){
    let movement_factor = (ANIMATION_DURATION - animate_timer) / ANIMATION_DURATION;
    
    let render_velocity = [
      velocity_to_next_pos[0] * movement_factor,
      velocity_to_next_pos[1] * movement_factor
    ];
    
    let render_pos = getNextPos(render_velocity);
    
    image(
      head_image, 
      render_pos[0] * cell_size, 
      render_pos[1] * cell_size, 
      cell_size, 
      cell_size
    );
  }
  else {
    image(
      head_image, 
      head_pos[0] * cell_size, 
      head_pos[1] * cell_size, 
      cell_size, 
      cell_size
    );
  }
}

function draw() {
  background(20);
  
  renderBoard()
  
  renderHead()
  
  updateMoving()
}
