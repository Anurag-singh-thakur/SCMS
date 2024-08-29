import { atom } from "recoil";

const noticeAtom = atom({
    key: 'notice',
    default: [] 
});
export default noticeAtom;