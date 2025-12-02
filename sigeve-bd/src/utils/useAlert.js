import { useContext } from 'react';
import  AlertContext  from './alertContext';

export function useAlert() {
  return useContext(AlertContext);
}
