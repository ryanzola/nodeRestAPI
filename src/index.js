import _ from 'lodash';
import './style.scss';

console.info('hej');

exports.component = () => {
  let element = document.createElement('div');
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
};
