/****************************************
************* BUDGET CONTROLLER *************
*****************************************/
let budgetController = (() => {

	//Expense Data structure
	const Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalIncome) {

		if	(totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	}

	//Income Data structure
	const Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	let calculateTotal = function(type) {
		let sum = 0;

		data.allItems[type].forEach(current => {
			sum += current.value;
		});

		// store total in data structure
		data.totals[type] = sum;

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
		},
		budget: 0,
		percentage: -1
	};


	/***********************
	Return PUBLIC FUNCTIONS
	***********************/
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

		deleteItem: (type, id) => {

			let ids, index;

			// returns brand new array
			ids = data.allItems[type].map(function (current) {
				return current.id
			});

			//retrieve index of element we want to use
			index = ids.indexOf(id);

			//delete from array if exists
			if (index !== -1) {
				// remove element at index
				data.allItems[type].splice(index, 1);
			}

		},

		calculateBudget: () => {

			// calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;

			// calculate the % of income that we spend

			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

		calcuatePercentages: () => {

			data.allItems.exp.forEach((current) => {
				current.calcPercentage(data.totals.inc);
			});

		},

		getPercentages: () => {

			let allPerc = data.allItems.exp.map((current) => {
				return current.getPercentage();
			});

			return allPerc;
		},

		getBudget: () => {

			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}

		},

		testing: () => {
			console.log(data);
		}
	};

})();

/****************************************
************* UI CONTROLLER *************
*****************************************/
let UIController = (() => {

  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'

	};
	
	const formatNumber = (num, type) => {

		let numSplit, int, dec;

		/* 
		+ or - before number 
		exactly 2 decimal points
		comma separating the thousands
		*/

		num = Math.abs(num);
		num = num.toFixed(2);

		numSplit = num.split('.');

		int = numSplit[0];

		if (int.length > 3) {
			int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); 
		}

		dec = numSplit[1];

		return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;

	};

	const nodeListForEach = function(list, callback) {

		for (var i = 0; i < list.length; i++) {
			callback(list[i], i);
		}
	};

	/***********************
	Return PUBLIC FUNCTIONS
	***********************/
  return {
    getInput: () => {
      return {
        //will be either inc or exp
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
		},
		
		//add item to DOM
		addListItems: (obj, type) => {

			let html, newHtml, element;

			// Create HTML string with placeholder text
			if(type === 'inc') {

				element = DOMstrings.incomeContainer;
			//income
			html = `<div class="item clearfix" id="inc-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${formatNumber(obj.value, type)}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
			} else if (type === 'exp') {

				element = DOMstrings.expensesContainer;
			//expenses	
			html = `<div class="item clearfix" id="exp-${obj.id}"><div class="item__description">${obj.description}</div><div class="right clearfix"><div class="item__value">${formatNumber(obj.value, type)}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
			}

			// Replace the placeholder text with actual data
			/* newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value); */

			// Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', html);

		},

		// delete from DOM
		deleteListItem: (selectorID) => {

			let el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);

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

		displayBudget: (obj) => {

			let type;

			obj.budget > 0 ? type = 'inc' : type = 'exp';

			//set element values to display on DOM
			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, type);
			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, type);
			

			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}

		},

		displayPercentages: (percentages) => {

			const fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

			nodeListForEach(fields, (current, index) => {

				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}

			});

		},

		displayMonth: () => {

			let now, year, month;

			now = new Date();
			year = now.getFullYear();
			month = now.toLocaleString('en-us', {month: 'long'})
			document.querySelector(DOMstrings.dateLabel).textContent = month + ' ' + year;


		},

		changeType: () => {

			let fields = document.querySelectorAll(
				DOMstrings.inputType + ',' +
				DOMstrings.inputDescription  + ',' +
				DOMstrings.inputValue
			);

			nodeListForEach(fields, (current) => {

				current.classList.toggle('red-focus');

			});

			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

		},

    getDOMstrings: () => {
      return DOMstrings;
    }
  };
})();

/****************************************
*********** GLOBAL APP CONTROLLER
*****************************************/
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
		
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);
	};
	
	const updateBudget = function() {

		// 1. Calculate the budget
		budgetCtrl.calculateBudget();

		// 2. Return the Budget
		let budget = budgetCtrl.getBudget();
		
		// 3. Display the budget on UI
		UICtrl.displayBudget(budget);

	};

	var updatePercentages = function() {

		// 1. Calculate percentages
		budgetCtrl.calcuatePercentages();

		// 2. Read % from budget controller
		let percentages = budgetCtrl.getPercentages();

		// 3. Update the UI with new %
		UICtrl.displayPercentages(percentages);

	};

  //add budget item
  const ctrlAddItem = function() {

		let input, newItem;

    // 1. Get the filled input data
    input = UIController.getInput();

		// Make sure input values are valid
		if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

			// 2. Add the item to budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. Add the new item to UI
			UICtrl.addListItems(newItem, input.type);

			// 4. Clear the fields
			UICtrl.clearFields();
			
			// 5. Calculate and update budget
			updateBudget();

			// 6. Calc and update percentages
			updatePercentages();

		}
	};
	
	const ctrlDeleteItem = (event) => {

		let itemID, splitID, type, id;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID) {

			// inc-1 split method - gather item info
			splitID = itemID.split('-');
			type = splitID[0];
			id = parseInt(splitID[1]);

			// 1. Delete the item from the data structure
			budgetCtrl.deleteItem(type, id);

			// 2. Delete item from UI
			UICtrl.deleteListItem(itemID);

			// 3. Update and show new budget
			updateBudget();

			// 4. Calc and update percentages
			updatePercentages();

		}
	};

	/***********************
	Return PUBLIC FUNCTIONS
	***********************/
  return {
    init: () => {
			console.log('App has started');
			UICtrl.displayMonth();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
      setupEventListeners();
    }
	};
	
})(budgetController, UIController);

controller.init();
