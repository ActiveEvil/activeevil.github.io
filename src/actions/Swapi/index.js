import axios from 'axios';

export const RECEIVE_CHARACTER_DATA = 'RECEIVE_CHARACTER_DATA';
export const SEARCH_CHARACTER_DATA = 'SEARCH_CHARACTER_DATA';
export const SET_PROFILE_DATA = 'SET_PROFILE_DATA';

function receiveCharacterData(characters) {
  return {
    type: RECEIVE_CHARACTER_DATA,
    characters,
    receivedAt: Date.now(),
  };
}

export function partialMatchCharacters(search) {
  return {
    type: SEARCH_CHARACTER_DATA,
    search,
    receivedAt: Date.now(),
  };
}

export function characterSelection(profile) {
  return {
    type: SET_PROFILE_DATA,
    profile,
    receivedAt: Date.now(),
  };
}


async function loadCharacterData(url) {
  const cache = sessionStorage.getItem('characters');

  if (cache) {
    return JSON.parse(cache);
  }

  const characters = [];
  const response = await axios.get(url);
  const { next, results } = response.data;

  characters.push(...results);

  if (next) {
    const moreCharacters = await loadCharacterData(next)

    characters.push(...moreCharacters);
  }

  sessionStorage.setItem('characters', JSON.stringify(characters));

  return characters;
}

export function fetchCharacterData(url) {
  return async function fetchThunk(dispatch) {
    const characters = await loadCharacterData(url);

    dispatch(receiveCharacterData(characters));
  };
}
