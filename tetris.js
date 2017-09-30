// player is object containing matrix & position and score of player
// color is constant containing colors of 7 pieces
// arena is a matrix of 20 row and 12 column all of them fill with ziro and it save pieces when they arrive the end of canvas
// dropcounter and dropinterval and lastime are use in update function for currect timing in 1 second
// 
const canvas=document.getElementById('tetris');
const context=canvas.getContext('2d');
context.scale(20,20);

const player={
	matrix:null,
	pos:{x:0,y:0},
	score:0,
};

const color=[
	null,'#FF0D72','#0DC2FF','#0DFF72','#F538FF','#FF8E0D','#FFE138','#3877FF'];

const arena=createMatrix(12,20);

let dropCounter=0;
let dropInterval=500;
let lastTime=0;





//arenasweep is a function used when a row fill with 1 and it should delete and give score to player
function arenaSweep(){
	let rowCount=1;
	outer : for(let y=arena.length-1;y>0;--y){
		for(let x=0;x<arena[y].length;++x){
			if (arena[y][x]==0) {
				continue outer;
			}
		}
		const row=arena.splice(y,1)[0].fill(0);
		arena.unshift(row);
		++y;
		player.score+=rowCount * 10;
		rowCount*=2;
	}
}
//collide function is for piecies that do not collide with canvas width and heigth and other pieces
function collide(arena,player){
	const [m,o]=[player.matrix,player.pos];
	for (let y =0;y<m.length;y++) {
		for(let x=0;x<m[y].length;x++){
			if (m[y][x]!==0 && (arena[y+o.y] && arena[y+o.y][x+o.x])!==0) {
				return true;
			}
		}
	}
	return false;
}


//create matrix give w for column and h for row and creatematrix
function createMatrix(w,h){
	const matrix=[];
	while (h--) {
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}
//this is the function with type parameter that determine one of 7 pieces and return the matrix of that pieces
function createPiece(type){
	if (type=='T') {
		return[
			[0,0,0],
			[1,1,1],
			[0,1,0],
			];
	}else if (type=='S') {
		return[
			[0,6,6],
			[6,6,0],
			[0,0,0],
			];
	}else if (type=='L') {
		return[
			[0,3,0],
			[0,3,0],
			[0,3,3],
			];
	}else if (type=='J') {
		return[
			[0,4,0],
			[0,4,0],
			[4,4,0],
			];
	}else if (type=='O') {
		return[
			[2,2],
			[2,2],
			];
	}
	else if (type=='I') {
		return[
			[0,5,0,0],
			[0,5,0,0],
			[0,5,0,0],
			[0,5,0,0],
			];
	}
	else if (type=='Z') {
		return[
			[7,7,0],
			[0,7,7],
			[0,0,0],
			];
	}
}
//draw function draw the canvas and arena (matrix of 0 at first) and draw player pieces.this function use in update function
function draw(){
	context.fillStyle='#000';
	context.fillRect(0,0,canvas.width,canvas.height);
	drawMatrix(arena,{x:0,y:0})
	drawMatrix(player.matrix,player.pos);
}
//it,s for draw of matrix with offset of them(position of them)
function drawMatrix(matrix,offset){
	matrix.forEach((row,y) =>{
		row.forEach((value,x) =>{
			if (value!==0) {
				context.fillStyle=color[value];
				context.fillRect(x+offset.x,
								 y+offset.y,
								 1,1);
			}
		});
	});
}
//merge function merge pieces into arena matrix when one piece arrive at the end of canvas
function merge(arena,player){
	player.matrix.forEach((row,y)=>{
		row.forEach((value,x)=>{
			if (value!==0) {
				arena[y+player.pos.y][x+player.pos.x]=value;
			}
		});
	});
}
//every second drop pieces by one
function playerDrop(){
	player.pos.y++;
	if (collide(arena,player)) {
		player.pos.y--;
		merge(arena,player);
		playerReset();
		arenaSweep();
		updateScore();
	}
	dropCounter=0;
}
//do not let pieces go out of canvas
function playerMove(dir){
	player.pos.x+=dir;
	if (collide(arena,player)) {
		player.pos.x-=dir;
	}

}
//when pieces arrive at the end it,s randomize another pieces and start again
function playerReset(){
	const pieces='ILJOTSZ';
	player.matrix=createPiece(pieces[pieces.length * Math.random() | 0]);
	player.pos.y=0;
	player.pos.x=(arena[0].length/2 | 0)-
				 (player.matrix[0].length/2 | 0);
	if (collide(arena,player)) {
		arena.forEach((row=>row.fill(0)));
		player.score=0;
		updateScore();
	}
}
//for player rotation with dir parameter that can be +1 or -1 for cw rotaion and etc
function playerRotate(dir){
	const pos=player.pos.x;
	let offset=1;
	rotate(player.matrix,dir);
	while (collide(arena,player)) {
		player.pos.x+=offset;
		offset=-(offset+(offset >0 ? 1:-1));
		if (offset>player.matrix[0].length) {
			rotate(player.matrix,-dir);
			player.pos.x=pos;
			return;
		}
	}
}
//main rotate function
function rotate(matrix,dir){
	for(var y=0;y<matrix.length;y++){
		for(var x=0;x<y;x++){
			[
			matrix[x][y],
			matrix[y][x],
			]=[
			matrix[y][x],
			matrix[x][y],
			];
		}
	}
	if (dir>0) {
		matrix.forEach(row=>row.reverse());
	}else{
		matrix.reverse();
	}
}
//this function run every second 
function update(time=0){
	const deltaTime=time-lastTime;
	lastTime=time;
	dropCounter+=deltaTime;
	if (dropCounter>dropInterval) {
		playerDrop();
	}
	draw();
	requestAnimationFrame(update);
}
//for player score
function updateScore(){
	document.getElementById('score').innerText="امتیاز : "+player.score;
}
//event listener on keyboar <(37) >(39) downarro(40) w and q for 81 and 87
document.addEventListener('keydown',event =>{
	if (event.keyCode==37) {
		playerMove(-1);
	}else if (event.keyCode==39) {
		playerMove(+1);
	}else if (event.keyCode==40) {
		playerDrop();
	}else if (event.keyCode==81) {
		playerRotate(-1);
	}
	else if (event.keyCode==87) {
		playerRotate(+1);
	}
})
playerReset();
updateScore();
update();