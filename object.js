var robot = {
	body : {
		rotationY : 0,
		translation : [0,0,0],
		scale : [0.5, 1, 1]
	},
	head : {
		rotationY : 0,
		translation : [0,1.5,0],
		scale : [1.5, 0.5, 1.5]
	},
	hand1 : {
		rotationY : 0,
		translation : [2,0,0],
		scale : [1.7,0.2,0.2]
	}, 
	hand2 : {
		rotationY : 0,
		translation : [-2,0,0],
		scale : [1.7,0.2,0.2]
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
	}]
};