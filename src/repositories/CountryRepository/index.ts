import { Http } from "../../services";

const BASE_URL = 'https://restcountries.com/v3.1/name/';

export type Country = {
  name: any,
  flag: any,
  capital: string[],
  altSpellings: string[]
}

export default class CountryRepository {
  static fetchCountryByName(name: string) {
    return Http.get(`${BASE_URL}/${name}?fields=name,flag`);
  }
}