import {atom } from 'recoil';

const subjectAtom = atom({
    key: 'subject',
    default: [] // Ensure it's an array
});


export default subjectAtom;