var DROPDOWN_VALUES = {
    nullValues : ['string', 'int', 'long', 'double', 'date'],
    textValues: ['bool', 'bucket', 'enum', 'array']
};
var TABLE = document.getElementById('table-body');
var ROW_TEMPLATE = document.getElementById('row-template');
var ADD_ROW = document.getElementById('add-row');
var ROW_COUNT = 0;
var DATA_COLLECTION = {};
var ADD_OPTION_TEMPLATE = document.querySelector('.add-option-container.template');
var REMOVE_OPTION_TEMPLATE = document.querySelector('.remove-option-container.template');


populateOptions();
addNewRow();
setButtonListeners();

function populateOptions() {
    var select = ROW_TEMPLATE.querySelector('select');
    var option = select.querySelector('option');

    DROPDOWN_VALUES.nullValues.concat(DROPDOWN_VALUES.textValues).forEach((dropdownValue) => {
        var newOption = option.cloneNode(true);
        newOption.value = dropdownValue;
        newOption.textContent = dropdownValue;
        select.appendChild(newOption);
    });
}

function addNewRow(){
    var newRow = ROW_TEMPLATE.cloneNode(true);

    ROW_COUNT++;
    newRow.id = 'row-' + ROW_COUNT;
    newRow.dataset.index = ROW_COUNT;
    TABLE.appendChild(newRow);
    configureNewRow(newRow);
    createDataObject(ROW_COUNT);
}

function createDataObject(row){
    var rowElements = 5;
    DATA_COLLECTION[row] = new Array();
    for(i=0; i<rowElements; i++){
        DATA_COLLECTION[row].push('NULL');
    }
}

function configureNewRow(row) {
    row.classList.remove('hidden');
    addRemoveRowHandler(row);
    addSelectionListener(row);
    addInputListener(row);
}

function addRemoveRowHandler(row){
    var removeButton = row.querySelector('.remove');
    var objectID = row.dataset.index;

    removeButton.classList.remove('hidden');
    removeButton.addEventListener('click', () => {
        row.parentElement.removeChild(row);
        ROW_COUNT--;
        Object.keys(DATA_COLLECTION).forEach((ind)=>{
            if(ind.indexOf(objectID)>-1) delete DATA_COLLECTION[ind];
        });
    });
}

function addSelectionListener(row) {
    var select = row.querySelector('select');
    var sourceValue = row.querySelector('.source-value');
    var displayValue = row.querySelector('.display-value');

    select.addEventListener('change', () => {
        var selectedValue = select.selectedOptions[0].value;
        if(selectedValue === 'bool'){
            setBoolOption(sourceValue, displayValue);
            disableAddingOption(row);
        }
        else if(DROPDOWN_VALUES.textValues.indexOf(selectedValue) > -1){
            toggleInputValueFields(sourceValue, displayValue, false, '');
            removeBoolOptions(row);
            enableAddingOption(row);
        } else {
            toggleInputValueFields(sourceValue, displayValue, true, 'NULL')
            removeBoolOptions(row);
            disableAddingOption(row);
        }
    })
}

function addInputListener(row, source, display){
    var actions = {
        'INPUT':'keyup',
        'SELECT':'change'
    }
    var objectID = row;
    if(row.id) objectID = row.dataset.index;
    var inputs = [];
    
    if(!source && !display && row.id) {
        inputs = row.querySelectorAll('input, select');
    } else {
        inputs = [,,,source, display];
    }

    inputs.forEach((el, index) => {
        el.addEventListener(actions[el.tagName], () => {
            Object.keys(DATA_COLLECTION).forEach((ind)=>{
                if(objectID.indexOf('/') < 0){
                    DATA_COLLECTION[objectID][index] = el.value;
                    if(ind.split('/')[0] === objectID && index < 3) {
                        DATA_COLLECTION[ind][index] = el.value;
                    }
                } else {
                    DATA_COLLECTION[objectID][index] = el.value;
                }
            })
        });
    });
}

function toggleInputValueFields(sourceValue, displayValue, disabled, placeholder){
    var rowID = parseInt(getParent(sourceValue, '.crm-row').id.replace('row-', ''));
    DATA_COLLECTION[rowID][3] =  DATA_COLLECTION[rowID][4] = placeholder;

    sourceValue.disabled = disabled;
    sourceValue.placeholder = sourceValue.value = placeholder;

    displayValue.disabled = disabled;
    displayValue.placeholder = displayValue.value = placeholder;
}

function setBoolOption(sourceValue, displayValue){
    var sourceContainer = sourceValue.parentElement;
    var displayContainer = displayValue.parentElement;
    var newSourceContainer = sourceContainer.cloneNode(true);
    var newDisplayContainer = displayContainer.cloneNode(true);
    var newSourceValue = newSourceContainer.querySelector('input');
    var newDisplayValue = newDisplayContainer.querySelector('input');
    newSourceContainer.classList.add('bool');
    newDisplayContainer.classList.add('bool');

    sourceValue.value = 'True';
    newSourceValue.value = 'False';
    sourceContainer.parentElement.appendChild(newSourceContainer);
    displayValue.disabled = newDisplayValue.disabled = false;
    sourceValue.disabled = newSourceValue.disabled = true;
    displayValue.value = newDisplayValue.value = displayValue.placeholder = newDisplayValue.placeholder = '';
    displayContainer.parentElement.appendChild(newDisplayContainer);
}

function enableAddingOption(row){
    var newOptionButton = ADD_OPTION_TEMPLATE.cloneNode(true);
    newOptionButton.classList.remove('template');
    row.querySelector('.data-type-container').appendChild(newOptionButton);
    newOptionButton.classList.remove('removed');
    newOptionButton.addEventListener('click', addNewOption);
}

function addNewOption(){
    var row = getParent(this, '.crm-row');
    var sourceValues = [].slice.call(row.querySelectorAll('.source-value-container'));
    var displayValues = [].slice.call(row.querySelectorAll('.display-value-container'));
    
    var newSourceValue = sourceValues[0].cloneNode(true);
    var newSourceInput = newSourceValue.querySelector('input');
    newSourceValue.dataset.index = displayValues.length;
    newSourceInput.value = '';
    
    var newDisplayValue = displayValues[0].cloneNode(true);
    var newDisplayInput = newDisplayValue.querySelector('input')
    newDisplayValue.dataset.index = displayValues.length;
    newDisplayValue.querySelector('button').classList.remove('hidden');
    newDisplayInput.value = '';
    
    sourceValues[0].parentElement.appendChild(newSourceValue);
    displayValues[0].parentElement.appendChild(newDisplayValue);

    var dataObjectId = [row.dataset.index, sourceValues.length].join('/');
    createDataObject(dataObjectId);
    DATA_COLLECTION[dataObjectId] = createOptionDataSet(row);
    addInputListener(dataObjectId, newSourceInput, newDisplayInput);
    setRemoveOptionListener(row);
}

function setRemoveOptionListener(row){
    var removeOptionButtons = row.querySelectorAll('.display-value-container--remove');
    [].slice.call(removeOptionButtons).forEach(button => {
        button.addEventListener('click', removeOption);
    })
}

function removeOption(){
    var opntionId = this.parentElement.dataset.index;
    var row = getParent(this, '.crm-row');
    var dataObjectId = [row.dataset.index, opntionId].join('/');
    [].slice.call(row.querySelectorAll('[data-index="' + opntionId + '"]')).forEach(field => {
        field.remove();
        delete DATA_COLLECTION[dataObjectId];
    })
}

function createOptionDataSet(row){
    var displayName = row.querySelector('[name="display-name"]').value;
    var columnName = row.querySelector('[name="column-name"]').value;
    var type = row.querySelector('[name="data-type"]').value;
    var sourceValues = row.querySelectorAll('.source-value');
    var displayValues = row.querySelectorAll('.display-value');
    var sourceValue = sourceValues[sourceValues.length-1].value;
    var displayValue = displayValues[sourceValues.length-1].value;

    return [displayName, columnName, type, sourceValue, displayValue];
}

function disableAddingOption(row){
    var addButton = row.querySelector('.add-option-container')
    if(addButton) addButton.parentElement.removeChild(addButton);
}

function removeBoolOptions(row){
    [].slice.call(row.querySelectorAll('.bool')).forEach((el) => {
        if(el) el.parentElement.removeChild(el);
    })
}

function setButtonListeners(){
    document.querySelectorAll('#add-row, #export-file').forEach((button) => {
        if(button.id === 'add-row'){
            button.addEventListener('click', addNewRow);
        } else {
            button.addEventListener('click', generateFile);
        }
    })
}

function generateFile(){
    var fileHeader = 'Field_Name,Display_Field_Name,Type,Dropdown_Source_Value,Dropdown_Display_Value\n';
    var sortedData = sortObject(DATA_COLLECTION);
    
    var text = fileHeader + sortedData.map((array) => {
        array[1].map(value => {
            if(value === 'undefined' || value === "") return 'NULL';
        });
        return array[1].join(',');
    }).join('\n');

    // var text = fileHeader + Object.keys(sortedData).map((el) => {
    //     sortedData[el].map((value) => {
    //         if(value === 'undefined') return 'NULL';
    //     })
    //     return sortedData[el].join(',');
    // }).join('\n');
    var filename = "CRM-mapping_" + Date.now() + ".csv";
    downloadFile(filename, text);
}

function sortObject(object){
    return Object.entries(object).sort((a,b) => {
        return a[0].split('/')[0] - b[0].split('/')[0]
    })
}


function downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function getParent(element, selector) {
    var currentElement = element;
  
    do {
      currentElement = currentElement.parentNode;
      if (currentElement.matches(selector)) {
        return currentElement;
      }
    } while (currentElement.nodeName.toLowerCase() !== 'body');
  
    return null;
  }