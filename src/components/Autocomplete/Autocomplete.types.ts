export type SuggestionType = {
  label: string;
  value: any;
};

export interface AutocompleteProps {
  id?: string;
  label?: string;
  placeholder?: string;
  initialValue?: SuggestionType;
  onSelect?: Function;
  onClear?: Function;
}
