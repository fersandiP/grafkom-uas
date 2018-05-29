class MatrixStack {
	constructor(){
		this.stack = [];

		this.restore();
	}

	restore () {
		this.stack.pop();
	  // Never let the stack be totally empty
	  if (this.stack.length < 1) {
	  	this.stack[0] = mat4(1);
	  }
	}

	save () {
		this.stack.push(this.getCurrentMatrix());
	}

	getCurrentMatrix () {
		return this.stack[this.stack.length - 1].slice();
	}
	
	setCurrentMatrix (m) {
		return this.stack[this.stack.length - 1] = m;
	}
}
