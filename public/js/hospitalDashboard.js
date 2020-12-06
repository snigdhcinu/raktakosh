let op1 = document.getElementsByClassName('btn')[0];
let op2 = document.getElementsByClassName('btn')[1];
let op3 = document.getElementsByClassName('btn')[2];

let content1 = document.getElementsByClassName('mainbar')[0];
let content2 = document.getElementsByClassName('mainbar')[1];
let content3 = document.getElementsByClassName('mainbar')[2];

op1.addEventListener('click',mode1);
op2.addEventListener('click',mode2);
op3.addEventListener('click',mode3);

function mode1(){
	op1.style.color = '#fff';
	op2.style.color = '#bbb';
	op3.style.color = '#bbb';
	content1.style.display = 'grid';
	content2.style.display = 'none';
	content3.style.display = 'none';
}
function mode2(){
	op2.style.color = '#fff';
	op1.style.color = '#bbb';
	op3.style.color = '#bbb';
	content2.style.display = 'grid';
	content1.style.display = 'none';
	content3.style.display = 'none';
}
function mode3(){
	op2.style.color = '#bbb';
	op1.style.color = '#bbb';
	op3.style.color = '#fff';
	content2.style.display = 'none';
	content1.style.display = 'none';
	content3.style.display = 'grid';
}


// By default op1 will be active i.e., mode1 by default
	op1.style.color = '#fff';
	op2.style.color = '#bbb';
	op3.style.color = '#bbb';
	content1.style.display = 'grid';
	content2.style.display = 'none';
	content3.style.display = 'none';