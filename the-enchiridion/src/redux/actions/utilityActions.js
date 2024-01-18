export const TRIGGER = 'TRIGGER';

export const trigger = (payload) => {
    return {
        type: TRIGGER,
        payload: payload,
    }
}