const ROTATION_X = 0b1;
const ROTATION_Y = 0b10;
const ROTATION_Z = 0b100
const TRANSLATE = 0b1000;

var parameter = {
	robot: {
		bodyTranslation: [-5, -2, 12],
		bodyRotationY: 0
	},
	spinner: {
		rotation: 0
	},
	walkingGirl: {
		translateX: 0,
		translateZ: -5,
	}
};

var robotState = {
	S_Z_MAJU : 0,
	S_Z_MUNDUR : 1,
	S_PUTAR_MAJU : 2,
	S_PUTAR_MUNDUR : 3,

	Z_THRESHOLD : 20,
	Z_MIN_THRESHOLD : 5
};

var robotAction = {
	current_state : robotState.S_Z_MAJU,

	action (data) {
		switch(this.current_state){
			case robotState.S_Z_MAJU:
				data[2] += 0.1;
				break;
			case robotState.S_Z_MUNDUR:
				data[2] -= 0.1;
				break;
			case robotState.S_PUTAR_MUNDUR:
				data = (data + 1) % 360;
				break;
			case robotState.S_PUTAR_MAJU:
				data = (data + 1) % 360;
				break;
		}

		this.checkChangeState(data);
		return data;
	},

	checkChangeState(data) {
		switch(this.current_state){
			case robotState.S_Z_MAJU:
				if (data[2] >= robotState.Z_THRESHOLD){
					this.current_state = robotState.S_PUTAR_MUNDUR;
				}
				break;
			case robotState.S_Z_MUNDUR:
				if (data[2] <= robotState.Z_MIN_THRESHOLD){
					this.current_state = robotState.S_PUTAR_MAJU;
				}
				break;
			case robotState.S_PUTAR_MUNDUR:
				if (data == 180){
					this.current_state = robotState.S_Z_MUNDUR;
				}
				break;
			case robotState.S_PUTAR_MAJU:
				if (data == 0){
					this.current_state = robotState.S_Z_MAJU;
				}
				break;
		}
	}
}

var robot = {
	body: {
		rotationY() {
			return parameter.robot.bodyRotationY;
		},
		translation () {
			return parameter.robot.bodyTranslation;
		},
		scale: [0.5, 0.7, 0.5],
		function: ROTATION_Y | TRANSLATE,
		objName: 'cylinder',
	},
	head: {
		rotationY: 0,
		translation: [0, 1.5, 0],
		scale: [1.5, 0.7, 1.5],
	},
	hand1: {
		rotationY: 0,
		translation: [2, 0, 0],
		scale: [1, 0.2, 0.2],
		objName: 'cylinder'
	},
	hand2: {
		rotationY: 0,
		translation: [-2, 0, 0],
		scale: [1, 0.2, 0.2],
		objName: 'cylinder'
	},
	eye1: {
		rotationY: 45,
		translation: [-0.5, 0.5, 1],
		scale: [0.1, 0.1, 0.1]
	},
	eye2: {
		rotationY: 45,
		translation: [0.5, 0.5, 1],
		scale: [0.1, 0.1, 0.1]
	},
	mouth: {
		rotationY: 0,
		translation: [0, -0.5, 1],
		scale: [0.5, 0.1, 0.1]
	},
	nose: {
		rotationY: 0,
		translation: [0, 0, 1],
		scale: [0.1, 0.1, 0.5]
	},
	leg1: {
		rotationY: 0,
		translation: [-0.7, -1.5, 0],
		scale: [0.3, 0.5, 0.3],
		objName: 'cylinder'
	},
	leg2: {
		rotationY: 0,
		translation: [0.7, -1.5, 0],
		scale: [0.3, 0.5, 0.3],
		objName: 'cylinder'
	},

	hierarchy: [{
		name: 'body',
		hasChild: true,
		childs: [
			{
				name: 'head',
				hasChild: true,
				childs: [
					{
						name: 'nose',
						hasChild: false
					},
					{
						name: 'eye1',
						hasChild: false,
					},
					{
						name: 'eye2',
						hasChild: false
					},
					{
						name: 'mouth',
						hasChild: false
					}
				]
			},
			{
				name: 'hand1',
				hasChild: false
			},
			{
				name: 'hand2',
				hasChild: false
			},
			{
				name: 'leg1',
				hasChild: false
			},
			{
				name: 'leg2',
				hasChild: false
			}
		]
	}],
};


var world = {
	ground: {
		rotationY: 0,
		translation: [0, -3, 2],
		scale: [4, 0.01, 2000],
		color: [0.1, 0.1, 0.1]
	},
	wall: {
		rotationY: 0,
		translation: [0, 0, 1200],
		scale: [2000, 2000, 0.1],
		color: [0.2, 0.2, 0.2],
		texture: 'wall',
	},
	hierarchy: [{
		name: 'ground',
		hasChild: false,
	},
	{
		name: 'wall',
		hasChild: false
	}]
}

var suzanne = {
	head: {
		rotationY: 180,
		translation: [0, 1.3, 0],
		scale: [2, 1, 2.5],
		objName: 'suzanne'
	},
	body: {
		rotationY: 0,
		translation: [5, 0, 20],
		scale: [1, 2, 1],
		objName: 'cube'
	},
	hand1: {
		rotationY: 0,
		translation: [1.9, 0.5, 0],
		scale: [1, 0.2, 1],
		objName: 'sphere'
	},
	hand2: {
		rotationY: 0,
		translation: [-1.9, 0.5, 0],
		scale: [1, 0.2, 1],
		objName: 'sphere'
	},
	leg1: {
		rotationY: 0,
		translation: [-0.7, -1.5, 0],
		scale: [0.3, 0.5, 0.3],
		objName: 'sphere'
	},
	leg2: {
		rotationY: 0,
		translation: [0.7, -1.5, 0],
		scale: [0.3, 0.5, 0.3],
		objName: 'sphere'
	},
	hierarchy: [{
		name: 'body',
		hasChild: true,
		childs: [
			{
				name: 'head',
				hasChild: false,
			},
			{
				name: 'hand1',
				hasChild: false
			},
			{
				name: 'hand2',
				hasChild: false
			},
			{
				name: 'leg1',
				hasChild: false
			},
			{
				name: 'leg2',
				hasChild: false
			},
		]
	}]
}


var test = {
	test: {
		rotationY: 0,
		rotationX: 90,
		translation: [0, 0, 0],
		scale: [1, 1, 1],
		objName: 'torus'
	},
	hierarchy: [{
		name: 'test',
		hasChild: false,
	}]
}

var spinner = {
	ring1: {
		translation: [-10, 0, -10],
		scale: [10, 10, 10],
		objName: 'torus'
	},
	ring2: {
		translation: [10, 0, -10],
		scale: [10, 10, 10],
		objName: 'torus',
	},
	ring3: {
		translation: [0, 0, 10],
		scale: [10, 10, 10],
		objName: 'torus',
	},
	mid: {
		rotationX: 90,
		rotationY() {
			return parameter.spinner.rotation;
		},
		translation: [0, 0, 10],
		scale: [0.025, 0.025, 0.025],
		objName: 'sphere',
		function: ROTATION_Y,
	},
	hierarchy: [{
		name: 'mid',
		hasChild: true,
		childs: [
			{
				name: 'ring1',
				hasChild: false,
			},
			{
				name: 'ring2',
				hasChild: false,
			},
			{
				name: 'ring3',
				hasChild: false,
			},
		]
	}]
}


var walkingGirl = {
	walkingGirl: {
		rotationY: 0,
		translation() {
			return [parameter.walkingGirl.translateX, -2, parameter.walkingGirl.translateZ]
		},
		scale: [1, 1, 1],
		objName: 'WalkingGirl',
		color: [1, 0, 0],
		function: TRANSLATE,
	},
	hierarchy: [{
		name: 'walkingGirl',
		hasChild: false,
	}]
}