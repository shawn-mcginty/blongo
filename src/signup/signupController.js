class SignupController {
	constructor($scope, $timeout) {
		this.email;
		this.displayName;
		this.password;
		this.password2;
		this.ready = false;
		this.passwordFeedback = null;
		this.emailFeedback = null;
		this.displayNameFeedback = null;
		this.generalError = null;

		// special angular functions
		this.$scope = $scope;
		this.$timeout = $timeout;
	}

	checkPasswords() {
		const form = this.$scope.form;
		if (form.password2.$dirty && form.password.$dirty &&
			this.password !== undefined && this.password2 !== undefined) {
			if (this.password2 === this.password) {
				this.clearPasswordFeedback();
				$('#password-group').addClass('has-success');
			} else {
				this.passwordFeedback = 'Your passwords don\'t match.';
				$('#password-group').addClass('has-danger');
			}
		} else {
			this.clearPasswordFeedback();
		}

		this.checkIfReady();
	}

	clearPasswordFeedback() {
		this.passwordFeedback = null;
		$('#password-group').removeClass('has-danger');
		$('#password-group').removeClass('has-success');
	}

	checkIfReady() {
		const $scope = this.$scope;
		if (this.isPasswordValid() && this.isEmailValid() &&
			this.isDisplayNameValid()) {
			this.ready = true;
		} else {
			this.ready = false;
		}
	}

	isPasswordValid() {
		return (this.password !== undefined && this.password2 !== undefined
			&& this.passwordFeedback === null);
	}

	checkEmailAvailability() {
		const form = this.$scope.form;
		if (form.email.$dirty && this.email !== undefined) {
			fetch(`/api/user/count?email=${encodeURIComponent(this.email)}`)
				.then((response) => {
					if (!response.ok) {
						throw new Error();
					}

					return response.json();
				}).then((response) => {
					if (response && response.count === 0) {
						this.$timeout(() => this.$scope.$apply(() => {
							this.clearEmailFeedback();
							$('#email-group').addClass('has-success');
							this.checkIfReady();
						}));
					} else {
						this.$timeout(() => this.$scope.$apply(() => {
							this.emailFeedback = 'Looks like that email address is already in use.  Try logging in.' +
							'  If you forgot your password, that\'s too bad, I didn\'t implement a forgot' +
							' password feature.';
							$('#email-group').addClass('has-danger');
						}));
					}
				}).catch((err) => {
					console.error(err);
					this.$timeout(() => this.$scope.$appy(() => {
						this.emailFeedback = 'I can\'t check if your email is available right now.' +
							' Try again later I guess.';
						this.checkIfReady();
					}));
				});
		} else {
			this.clearEmailFeedback();
			this.checkIfReady();
		}
	}

	clearEmailFeedback() {
		this.emailFeedback = null;
		$('#email-group').removeClass('has-success');
		$('#email-group').removeClass('has-danger');
	}

	isEmailValid() {
		return this.email != undefined && this.emailFeedback === null;
	}

	checkDisplayNameAvailability() {
		const form = this.$scope.form;
		if (form.displayName.$dirty && this.displayName !== undefined) {
			fetch(`/api/user/count?displayName=${encodeURIComponent(this.displayName)}`)
				.then((response) => {
					if (!response.ok) {
						throw new Error();
					}

					return response.json();
				}).then((response) => {
					if (response && response.count === 0) {
						this.$timeout(() => this.$scope.$apply(() => {
							this.clearDisplayNameFeedback();
							$('#display-name-group').addClass('has-success');
							this.checkIfReady();
						}));
					} else {
						this.$timeout(() => this.$scope.$apply(() => {
							this.displayNameFeedback = 'Pick a different name, someone already has yours.';
							$('#display-name-group').addClass('has-danger');
						}));
					}
				}).catch((err) => {
					console.error(err);
					this.$timeout(() => this.$scope.$appy(() => {
						this.displayNameFeedback = 'I can\'t check if your name is available right now.' +
							' Try again later I guess.';
						this.checkIfReady();
					}));
				});
		} else {
			this.clearDisplayNameFeedback();
			this.checkIfReady();
		}
	}

	clearDisplayNameFeedback() {
		this.displayNameFeedback = null;
		$('#display-name-group').removeClass('has-danger');
		$('#display-name-group').removeClass('has-success');
	}

	isDisplayNameValid() {
		return this.displayName !== undefined && this.displayNameFeedback === null;
	}

	doSignup() {
		if (this.ready) {
			fetch('/signup', {
				method: 'post',
				body: JSON.stringify({
					email: this.email,
					password: this.password,
					displayName: this.displayName,
				}),
				headers: { 'Content-Type': 'application/json' },
			}).then((response) => {
				if (!response.ok) {
					this.$timeout(() => this.$scope.$apply(() => {
						this.generalError = 'I\'m not sure what happened... but you' +
						' can\'t sign up right now.  Try again later.';
					}));
				} else {
					this.doLogin();
				}
			}).catch((err) => {
				console.error(err);
				this.$timeout(() => this.$scope.$apply(() => this.generalError = 'Something bad happened, try again.'));
			});
		}
	}

	doLogin() {
		// just build a form and submit it, let passport handle forwarding and junk
		const loginForm = document.createElement('form');
		const emailInput = document.createElement('input');
		const passwordInput = document.createElement('input');
		emailInput.name = 'email';
		emailInput.type = 'hidden';
		emailInput.value = this.email;
		passwordInput.name = 'password';
		passwordInput.type = 'hidden';
		passwordInput.value = this.password;
		loginForm.action = '/login';
		loginForm.method = 'POST';
		loginForm.append(emailInput);
		loginForm.append(passwordInput);
		document.body.appendChild(loginForm);
		loginForm.submit();

	}
}

module.exports = SignupController;