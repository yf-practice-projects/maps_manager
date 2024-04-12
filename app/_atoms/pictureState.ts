import { atom } from 'recoil';
import { Picture } from '../_definitions/store';

export const picturesState = atom<Picture[]>({
  key: 'picturesState', 
  default: [], 
});

export const editFlagState = atom<boolean>({
  key: "editFlagState",
  default: false
})