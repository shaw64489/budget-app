// BUDGET CONTROLLER
let budgetController = (() => {

	//Expense Data structure
	const Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	//Income Data structure
	const Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	//Full data structure
	const data = {

		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	};


	return {

		//create new item
		addItem: (type, des, val) => {

			let newItem, ID;

			// ID == last ID plus 1
			// Create new ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			// Create new item based on 'inc' or 'exp' type
			if (type === 'exp') {

				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {

				newItem = new Income(ID, des, val);
			}

			// Push it into our data structure
			data.allItems[type].push(newItem);

			// Return the new element
			return newItem;
		},

		testing: () => {
			console.log(data);
		}
	};

})();

// UI CONTROLLER
let UIController = (() => {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list'
  };

  return {
    getInput: () => {
      return {
        //will be either inc or exp
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
		},
		
		//add item to DOM
		addListItems: (obj, type) => {

			let html, newHtml, element;

			// Create HTML string with placeholder text
			if(type === 'inc') {

				element = DOMstrings.incomeContainer;
			//income
			html = `<div class="item clearfix" id="income-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${obj.value}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
			} else if (type === 'exp') {

				element = DOMstrings.expensesContainer;
			//expenses	
			html = `<div class="item clearfix" id="expense-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${obj.value}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
			}

			// Replace the placeholder text with actual data
			/* newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value); */

			// Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', html);

		},

		//Clear input fields
		clearFields: () => {

			let fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

			// trick it into thinking we have given it an array
			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach((current, index, array) => {
				current.value = '';
			});

			fieldsArr[0].focus();

		},

    getDOMstrings: () => {
      return DOMstrings;
    }
  };
})();

// GLOBAL APP CONTROLLER
let controller = ((budgetCtrl, UICtrl) => {

  //setup event listeners
  const setupEventListeners = function() {

    const DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', event => {

      // Check if keypress is enter
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  //add budget item
  const ctrlAddItem = function() {

		let input, newItem;

    // 1. Get the filled input data
    input = UIController.getInput();

		// 2. Add the item to budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);

		// 3. Add the new item to UI
		UICtrl.addListItems(newItem, input.type);

		// 4. Clear the fields
		UICtrl.clearFields();
		
		// 5. Calculate the budget
		
		// 6. Display the budget on UI
		
  };

  return {
    init: () => {
      console.log('App has started');
      setupEventListeners();
    }
	};
	
})(budgetController, UIController);

controller.init();
