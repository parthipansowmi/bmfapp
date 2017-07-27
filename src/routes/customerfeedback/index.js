

import React from 'react';

import Customerfeedback from './Customerfeedback';
import { apihost } from '../../config';
import {getSessionid} from '../../scripts/util';

export default {

  path: '/customerfeedback',

  async action({query}, {path}) {
     return <Customerfeedback  user="customer"/>;
}

};