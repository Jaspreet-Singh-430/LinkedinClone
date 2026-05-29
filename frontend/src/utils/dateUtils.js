import {format,parseISO,isValid} from 'date-fns';
export const formatDate = (dateString) => {
    const date=parseISO(dateString);
    if(isValid(date)){
        return format(date,'MM yyyy');
    }
    return 'Present';
}