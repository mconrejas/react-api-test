import React from "react";
import { Select } from "antd";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import countries from "world-countries";

const { Option } = Select;

type CountryCodeSelectorProps = {
  value?: any;
  style?: React.CSSProperties;
  onChange?: (value: string) => void;
};

const CountryCodeSelector: React.FC<CountryCodeSelectorProps> = ({ value, style, onChange }) => {
  const countryList = getCountries()
    .map((iso2) => {
      const countryData = countries.find((c) => c.cca2 === iso2);
      return {
        code: `+${getCountryCallingCode(iso2)}`,
        name: countryData?.name.common || iso2,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

  return (
    <Select placeholder="Select" style={style} showSearch optionFilterProp="children" onChange={onChange} defaultValue={value}>
      {countryList.map(({ code, name }) => (
        <Option key={`${code}-${name}`} value={code}>
          {code} ({name})
        </Option>
      ))}
    </Select>
  );
};

export default CountryCodeSelector;
