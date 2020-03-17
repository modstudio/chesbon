
import { extend, setInteractionMode } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/en.json';
import PhoneNumber from 'awesome-phonenumber';
import Vue from 'vue';

setInteractionMode('eager');

Object.keys(rules).forEach((rule) => {
  extend(rule, {
    ...rules[rule],
    message: messages[rule],
  });
});

extend('phone_number', {
  validate(value, args) {
    const countryCode = args.length ? args[0] : 'US';
    return new Promise((resolve) => {
      const phone = new PhoneNumber(value, countryCode);
      resolve({ valid: phone.isValid() });
    });
  },
  message: field => `${field} is not a valid phone number`,
});

const { postcodeValidator } = require('postcode-validator');
extend('postcode', {
  message: () => 'Zip code is not a valid',
  validate(value, args) {
    return new Promise((resolve) => {
      if (['US', 'CA'].includes(args[0])) {
        resolve({ valid: postcodeValidator(value, args[0]) });
      } else {
        resolve({ valid: true });
      }
    });
  },
});

extend('uniqueCause', {
  message: () => 'Cause should be unique',
  async validate(value, args) {
    console.log(value, args);
    const countCauses = await Vue.db.get(
      'SELECT count(*) as count FROM causes where name = ? and id <> IFNULL(?, 0)',
      [value, args[0]],
    );
    console.log('found cases:', countCauses);
    return countCauses.count === 0;
  },
});
