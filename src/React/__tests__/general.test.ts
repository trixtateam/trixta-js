import { getDefaultUISchema } from '../../utils/trixta';

describe('trixta Tests', () => {
  describe('React Json Schema Form', () => {
    describe('Request for Effect true', () => {
      it('Should merge uiSchema with norender true with existing uiSchema', () => {
        const requestForEffect = true;
        const inComingSchema = {
          'ui:submitButtonOptions': {
            submitText: 'Confirm Details',
            norender: false,
            props: {
              disabled: false,
              className: 'btn btn-info',
            },
          },
          firstName: {
            'ui:autofocus': true,
            'ui:emptyValue': '',
            'ui:autocomplete': 'family-name',
          },
          lastName: {
            'ui:title': 'Surname',
            'ui:emptyValue': '',
            'ui:autocomplete': 'given-name',
          },
          age: {
            'ui:widget': 'updown',
            'ui:title': 'Age of person',
            'ui:description': '(earthian year)',
          },
          bio: {
            'ui:widget': 'textarea',
          },
          password: {
            'ui:widget': 'password',
            'ui:help': 'Hint: Make it strong!',
          },
          date: {
            'ui:widget': 'alt-datetime',
          },
          telephone: {
            'ui:options': {
              inputType: 'tel',
            },
          },
        };

        const result = getDefaultUISchema(inComingSchema, requestForEffect);
        expect(result).toHaveProperty('ui:submitButtonOptions');
        expect(result['ui:submitButtonOptions']['norender']).toEqual(true);
      });

      it('Should return uiSchema with norender true with no uiSchema', () => {
        const requestForEffect = true;
        const inComingSchema = undefined;

        const result = getDefaultUISchema(inComingSchema, requestForEffect);
        expect(result).toHaveProperty('ui:submitButtonOptions');
        expect(result['ui:submitButtonOptions']['norender']).toEqual(true);
      });

      it('Should return uiSchema with norender true with uiSchema and norender false', () => {
        const requestForEffect = true;
        const inComingSchema = {
          'ui:submitButtonOptions': {
            submitText: 'Confirm Details',
            norender: true,
            props: {
              disabled: false,
              className: 'btn btn-info',
            },
          },
          firstName: {
            'ui:autofocus': true,
            'ui:emptyValue': '',
            'ui:autocomplete': 'family-name',
          },
          lastName: {
            'ui:title': 'Surname',
            'ui:emptyValue': '',
            'ui:autocomplete': 'given-name',
          },
          age: {
            'ui:widget': 'updown',
            'ui:title': 'Age of person',
            'ui:description': '(earthian year)',
          },
          bio: {
            'ui:widget': 'textarea',
          },
          password: {
            'ui:widget': 'password',
            'ui:help': 'Hint: Make it strong!',
          },
          date: {
            'ui:widget': 'alt-datetime',
          },
          telephone: {
            'ui:options': {
              inputType: 'tel',
            },
          },
        };

        const result = getDefaultUISchema(inComingSchema, requestForEffect);
        expect(result).toHaveProperty('ui:submitButtonOptions');
        expect(result['ui:submitButtonOptions']['norender']).toEqual(true);
      });
    });

    describe('Request for Effect false', () => {
      it('Should merge uiSchema with norender false with existing uiSchema', () => {
        const requestForEffect = false;
        const inComingSchema = {
          'ui:submitButtonOptions': {
            submitText: 'Confirm Details',
            norender: false,
            props: {
              disabled: false,
              className: 'btn btn-info',
            },
          },
          firstName: {
            'ui:autofocus': true,
            'ui:emptyValue': '',
            'ui:autocomplete': 'family-name',
          },
          lastName: {
            'ui:title': 'Surname',
            'ui:emptyValue': '',
            'ui:autocomplete': 'given-name',
          },
          age: {
            'ui:widget': 'updown',
            'ui:title': 'Age of person',
            'ui:description': '(earthian year)',
          },
          bio: {
            'ui:widget': 'textarea',
          },
          password: {
            'ui:widget': 'password',
            'ui:help': 'Hint: Make it strong!',
          },
          date: {
            'ui:widget': 'alt-datetime',
          },
          telephone: {
            'ui:options': {
              inputType: 'tel',
            },
          },
        };

        const result = getDefaultUISchema(inComingSchema, requestForEffect);
        expect(result).toHaveProperty('ui:submitButtonOptions');
        expect(result['ui:submitButtonOptions']['norender']).toEqual(false);
      });

      it('Should return uiSchema with norender false with no uiSchema', () => {
        const requestForEffect = false;
        const inComingSchema = undefined;

        const result = getDefaultUISchema(inComingSchema, requestForEffect);
        expect(result).toHaveProperty('ui:submitButtonOptions');
        expect(result['ui:submitButtonOptions']['norender']).toEqual(false);
      });

      it('Should return uiSchema with norender false with uiSchema and norender true', () => {
        const requestForEffect = false;
        const inComingSchema = {
          'ui:submitButtonOptions': {
            submitText: 'Confirm Details',
            norender: true,
            props: {
              disabled: false,
              className: 'btn btn-info',
            },
          },
          firstName: {
            'ui:autofocus': true,
            'ui:emptyValue': '',
            'ui:autocomplete': 'family-name',
          },
          lastName: {
            'ui:title': 'Surname',
            'ui:emptyValue': '',
            'ui:autocomplete': 'given-name',
          },
          age: {
            'ui:widget': 'updown',
            'ui:title': 'Age of person',
            'ui:description': '(earthian year)',
          },
          bio: {
            'ui:widget': 'textarea',
          },
          password: {
            'ui:widget': 'password',
            'ui:help': 'Hint: Make it strong!',
          },
          date: {
            'ui:widget': 'alt-datetime',
          },
          telephone: {
            'ui:options': {
              inputType: 'tel',
            },
          },
        };

        const result = getDefaultUISchema(inComingSchema, requestForEffect);
        expect(result).toHaveProperty('ui:submitButtonOptions');
        expect(result['ui:submitButtonOptions']['norender']).toEqual(false);
      });
    });
  });
});
