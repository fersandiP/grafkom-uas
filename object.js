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
		rotate: 0,
	},
	suzanne: {
		translation: [5, 0, 20],
		rotationY: 0
	},
	planet: {
		translation: [0, 2, 10],
		rotationX: 0,
		rotationY: 0,
		rotationZ: 0
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

var suzanneState = {
	S_PUTAR_DEPAN_KANAN : 0,
	S_PUTAR_BELAKANG_KANAN : 1,
	S_PUTAR_KIRI : 2,
	S_Z_Y_MAJU : 3,
	S_Y_KIRI : 4,
	S_Z_Y_MUNDUR : 5,

	Z_THRESHOLD : 25,
	Z_MIN_THRESHOLD : 20,
	X_THRESHOLD : 15,
	X_MIN_THRESHOLD : 5
};

var suzanneAction = {
	current_state : suzanneState.S_Z_MAJU,

	action (data) {
		switch(this.current_state){
			case suzanneState.S_PUTAR_DEPAN_KANAN:
				data = (data - 1) % 360;
				break;
			case suzanneState.S_Z_Y_MAJU:
				data[2] += 0.1;
				data[0] += 0.1;
				break;
			case suzanneState.S_PUTAR_BELAKANG_KANAN:
				data = (data - 1) % 360;
				break;
			case suzanneState.S_Z_Y_MUNDUR:
				data[2] -= 0.1;
				data[0] += 0.1;
				break;
			case suzanneState.S_PUTAR_KIRI:
				data = (data - 1) % 360;
				break;
			case suzanne.S_Y_KIRI:
				data[0] -= 0.1;
				break;
		}

		this.checkChangeState(data);
		return data;
	},

	checkChangeState(data) {
		switch(this.current_state){
			case suzanneState.S_PUTAR_DEPAN_KANAN:
				if (-data == 45){
					this.current_state = suzanneState.S_Z_Y_MAJU;
				}
				break;
			case suzanneState.S_Z_Y_MAJU:
				if (data[2] >= suzanneState.Z_THRESHOLD){
					this.current_state = suzanneState.S_PUTAR_BELAKANG_KANAN;
				}
				break;
			case suzanneState.S_PUTAR_BELAKANG_KANAN:
				if (-data == 135){
					this.current_state = suzanneState.S_Z_Y_MUNDUR;
				}
				break;
			case suzanneState.S_Z_Y_MUNDUR:
				if (data[0] >= suzanneState.X_THRESHOLD){
					this.current_state = suzanneState.S_PUTAR_KIRI;
				}
				break;
			case suzanneState.S_PUTAR_KIRI:
				if (-data == 270){
					this.current_state = suzanneState.S_Y_KIRI;
				}
				break;
			case suzanne.S_Y_KIRI:
				if (data[0] <= suzanneState.X_MIN_THRESHOLD){
					this.current_state = suzanneState.S_PUTAR_DEPAN_KANAN;
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
		texture: 'texture3'
	},
	head: {
		rotationY: 0,
		translation: [0, 1.5, 0],
		scale: [1.5, 0.7, 1.5],
		texture: 'texture5'
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
		color: [1, 1, 1],
		texture: 'texture4'
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
		rotationY() {
			return parameter.spinner.rotation;
		},
		translation: [0, 1.3, 0],
		scale: [2, 1, 2.5],
		color: [0.545, 0.27, 0.07],
		objName: 'suzanne',
		function: ROTATION_Y,
		texture: 'texture5'
	},
	body: {
		rotationY (){
			return parameter.suzanne.rotationY;
		},
		translation() {
			return parameter.suzanne.translation;
		},
		scale: [1, 2, 1],
		color: [0.545, 0.27, 0.07],
		objName: 'cylinder',
		function : TRANSLATE | ROTATION_Y,
		texture: 'texture4'
	},
	hand1: {
		rotationY: 0,
		translation: [1.9, 0.5, 0],
		scale: [1, 0.2, 1],
		objName: 'sphere',
		color: [0.545, 0.27, 0.07],
	},
	hand2: {
		rotationY: 0,
		translation: [-1.9, 0.5, 0],
		scale: [1, 0.2, 1],
		objName: 'sphere',
		color: [0.545, 0.27, 0.07],
	},
	leg1: {
		rotationY: 0,
		translation: [-0.7, -1.5, 0],
		scale: [0.3, 0.5, 0.3],
		objName: 'sphere',
		color: [0.545, 0.27, 0.07],
	},
	leg2: {
		rotationY: 0,
		translation: [0.7, -1.5, 0],
		scale: [0.3, 0.5, 0.3],
		objName: 'sphere',
		color: [0.545, 0.27, 0.07],
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
		color: [1.0, 1.0, 1.0],
		objName: 'torus',
		texture: 'texture4'
	},
	ring2: {
		translation: [10, 0, -10],
		scale: [10, 10, 10],
		color: [1.0, 1.0, 1.0],
		objName: 'torus',
		texture: 'texture4'
	},
	ring3: {
		translation: [0, 0, 10],
		scale: [10, 10, 10],
		color: [1.0, 1.0, 1.0],
		objName: 'torus',
		texture: 'texture4'
	},
	mid: {
		rotationX: 90,
		rotationY() {
			return parameter.spinner.rotation;
		},
		translation: [0, -1, 10],
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
		translation() {
			return [parameter.walkingGirl.translateX, -2, parameter.walkingGirl.translateZ]
		},
		scale: [1, 1, 1],
		objName: 'WalkingGirl',
		color: [1, 0, 0],
		rotationY() {
			return parameter.walkingGirl.rotate;
		},
		function: TRANSLATE | ROTATION_Y,
		texture: 'texture2'
	},
	hierarchy: [{
		name: 'walkingGirl',
		hasChild: false,
	}]
}

var planet = {
	orbit: {
		translation() {
			return parameter.planet.translation;
		},
		rotationX(){
			return parameter.planet.rotationX;
		},
		rotationY(){
			return parameter.planet.rotationY;
		},
		rotationZ(){
			return parameter.planet.rotationZ;
		},
		scale: [0.4,0.4,0.4],
		objName: "sphere",
		function : TRANSLATE | ROTATION_Y | ROTATION_X | ROTATION_Z,
		texture: 'texture3'
	},

	satellite1: {
		translation: [1.5,1.5,-1.5],
		scale: [0.3,0.3,0.3],
		objName: "sphere"
	},
	satellite2: {
		translation: [-1.5,1.5,1.5],
		scale: [0.3,0.3,0.3],
		objName: "sphere"
	},

	satellite3: {
		translation: [1.5,-1.5,1.5],
		scale: [0.3,0.3,0.3],
		objName: "sphere"
	},

	hierarchy : [
	{
		name: 'orbit',
		hasChild: true,
		childs : [
		{
			name: 'satellite1',
			hasChild: false
		},
		{
			name: 'satellite2',
			hasChild: false
		},
		{
			name: 'satellite3',
			hasChild: false
		}
		]
	}
	]
}