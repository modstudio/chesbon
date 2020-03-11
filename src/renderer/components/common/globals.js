import Vue from 'vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import LayoutsContainerLgComponent from './layouts/LayoutsContainerLgComponent';
import RightSideBarComponent from './right-side-bar/RightSideBarComponent';
import TextInputComponent from './form-elements/TextInputComponent';
import TextInfoComponent from './form-elements/TextInfoComponent';
import TelInputComponent from './form-elements/TelInputComponent';
import SelectComponent from './form-elements/SelectComponent';
import ActionButton from './form-elements/ActionButton';

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('LayoutsContainerLgComponent', LayoutsContainerLgComponent);
Vue.component('RightSideBarComponent', RightSideBarComponent);
Vue.component('TextInputComponent', TextInputComponent);
Vue.component('TextInfoComponent', TextInfoComponent);
Vue.component('TelInputComponent', TelInputComponent);
Vue.component('SelectComponent', SelectComponent);
Vue.component('ActionButton', ActionButton);