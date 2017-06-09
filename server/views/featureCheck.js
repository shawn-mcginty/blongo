var FeatureCheck = {};
FeatureCheck.hasAllRequiredFeatures = function() {
	if (!window.fetch) {
		return false;
	}

	try {
		eval('var _testArrowFunctions = (x) => x + 1;');
	} catch (e) {
		return false;
	}

	try {
		eval('class _TestClass { }');
	} catch (e) {
		return false;
	}

	try {
		eval('let _testLet = null;');
	} catch (e) {
		return false;
	}

	try {
		eval('const _testConst = null;')
	} catch (e) {
		return false;
	}

	try {
		eval('var _testTemplateLiterals = `this should be a string`;');
	} catch (e) {
		return false;
	}

	try {
		eval('var _testPromises = Promise.resolve();');
	} catch (e) {
		return false;
	}

	return true;
}

if (FeatureCheck.hasAllRequiredFeatures() !== true) {
	var errorDiv = document.createElement('div');
	errorDiv.innerHTML = 'Sorry!  It looks liek Blongo is using some web features' +
		' that are not supported by your current browser.  You should consider' +
		' switching to a <strong>modern</strong> web browser so that you can fully' +
		' enjoy newer features of the web!';
	errorDiv.classList.add('alert');
	errorDiv.classList.add('alert-danger');
	document.body.appendChild(errorDiv);
}