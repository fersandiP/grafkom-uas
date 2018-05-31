const ROTATION = 0b1;
const TRANSLATE = 0b10;

var parameter = {
	robot : {
		bodyRotationY : 0
	}
};

var robot = {
	body : {
		rotationY () {
			return parameter.robot.bodyRotationY;
		},
		translation : [0,0,0],
		scale : [0.5, 0.7, 0.5],
		function : ROTATION
	},
	head : {
		rotationY : 0,
		translation : [0,1.5,0],
		scale : [1.5, 0.5, 1.5]
	},
	hand1 : {
		rotationY : 0,
		translation : [2,0,0],
		scale : [1,0.2,0.2]
	}, 
	hand2 : {
		rotationY : 0,
		translation : [-2,0,0],
		scale : [1,0.2,0.2]
	},
	leg1 : {
		rotationY : 60,
		translation : [0,0,0],
		scale : [0.5, 1, 1]
	},
	leg2 : {
		rotationY : 60,
		translation : [0,0,0],
		scale : [0.5, 1, 1]
	},

	hierarchy : [{
		name : 'body',
		hasChild : true,
		childs : [
		{
			name : 'head',
			hasChild : false
		},
		{
			name : 'hand1',
			hasChild : false
		},
		{
			name : 'hand2',
			hasChild : false
		}
		]
	}],
};