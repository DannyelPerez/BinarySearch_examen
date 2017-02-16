angular.module('myApp', []).controller('appCtrl', function($scope) {
	var vm = this;
	vm.arraySize = 0;
	vm.showArray = false;
	vm.numberToSearch = '';
	vm.numbers = [];
	vm.currentStart=0;
	vm.currentEnd = 0;
	var timeOut = 2000;

	var previous = {};
	var colors = {
		default : '#009688',
		exist: '#D32F2F',
		currentPosition:'#FFEB3B',
		laterals: '#388E3C',
		inactive: '#BDBDBD'
	}
	vm.setArray = function() {
		vm.showArray = true;
		vm.numbers.length = 0;
		for(let i=0;i<vm.arraySize;i++){
			vm.numbers.push({id:i,color:colors.default});
		}
		vm.currentStart = 0;
		vm.currentEnd = vm.numbers.length -1;
	}

	function sleep(ms) {
	  return new Promise(resolve => setTimeout(resolve, ms));
	}
	
	function numberExists(number, startLimit, endLimit) {
		if(startLimit > endLimit)
			return false;
		changePrevious();
		changeLimitColors(vm.currentStart,vm.currentEnd);
		changeCenterColors(vm.currentStart,vm.currentEnd);
		let index = parseInt((startLimit+endLimit)/2);
		vm.numbers[index].color = colors.currentPosition;
		let middle = vm.numbers[index];
		if(middle.id == number){
			vm.numbers[index].color = colors.exist;
			return true;
		}
		if(middle.id < number){
			updatePrevious(index);
			vm.currentStart = index+1;
			vm.currentEnd = endLimit;
			return;
		}
		updatePrevious(index);
		vm.currentStart = startLimit;
		vm.currentEnd = index-1;
	}

	function updatePrevious(middle){
		previous.start = vm.currentStart;
		previous.end = vm.currentEnd;
		previous.middle = middle;
	}

	function changeLimitColors(start, end){
			vm.numbers[start].color = colors.laterals
			vm.numbers[end].color = colors.laterals
	}

	function changeCenterColors(start, end){
		for(let i = start+1; i<end;i++){
			vm.numbers[i].color = colors.inactive;
		}
	}

	function changePrevious(){
		if(!previous.middle)
			return;
		vm.numbers[previous.middle].color = colors.inactive;
		vm.numbers[previous.start].color = colors.inactive;
		vm.numbers[previous.end].color = colors.inactive;
	}

	vm.search = async function(){
		let result = numberExists(vm.numberToSearch,vm.currentStart,vm.currentEnd);
		if(result === true){
			previous = {};
			vm.currentStart=0;
			vm.currentEnd = vm.numbers.length -1;
			Materialize.toast('Number was found', 3000, 'rounded') 
		}
		else if(result === false){
			previous = {};
			vm.currentStart=0;
			vm.currentEnd = vm.numbers.length -1;
			Materialize.toast(`Number doesn't exist in the array`, 3000, 'rounded') 
		}
	}

});

