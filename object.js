const ROTATION = 0b1;
const TRANSLATE = 0b10;

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
		translation: [0, 0, 0],
		scale: [0.5, 0.7, 0.5],
		function: ROTATION
	},
	head: {
		rotationY: 0,
		translation: [0, 1.5, 0],
		scale: [1.5, 0.7, 1.5]
	},
	hand1: {
		rotationY: 0,
		translation: [2, 0, 0],
		scale: [1, 0.2, 0.2]
	},
	hand2: {
		rotationY: 0,
		translation: [-2, 0, 0],
		scale: [1, 0.2, 0.2]
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
	mouth : {
		rotationY : 0,
		translation : [0,-0.5,1],
		scale : [0.5, 0.1, 0.1]
	},
	nose: {
		rotationY: 0,
		translation: [0, 0, 1],
		scale: [0.1, 0.1, 0.5]
	},
	leg1: {
		rotationY: 0,
		translation: [-0.7, -1.5, 0],
		scale: [0.3, 0.5, 0.3]
	},
	leg2: {
		rotationY: 0,
		translation: [0.7, -1.5, 0],
		scale: [0.3, 0.5, 0.3]
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
						name : 'mouth',
						hasChild : false
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


var ground = {
	ground: {
		rotationY: 0,
		translation: [0, -2, 2],
		scale: [2, 0, 100]
	},
	hierarchy: [{
		name: 'ground',
		hasChild: false,
	}]
}