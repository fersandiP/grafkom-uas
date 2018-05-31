const ROTATION_X = 0b1;
const ROTATION_Y = 0b10;
const ROTATION_Z = 0b100
const TRANSLATE = 0b1000;

var parameter = {
	robot: {
		bodyRotationY: 0
	}
};

var robot = {
	body: {
		rotationY() {
			return parameter.robot.bodyRotationY;
		},
		translation: [-5, -2, 12],
		scale: [0.5, 0.7, 0.5],
		function: ROTATION_Y,
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
		translation: [0, 0, 1989],
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
		objName: 'cylinder'
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
