import React, { useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getDetails,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import styled from "styled-components";

const Page = styled.div`
  height: 100vh;
  display: flex;
  padding: 100px;
  flex-direction: column;
`;

const Input = styled.input`
  height: 40px;
  border: 1px solid black;
  border-radius: 5px;
  font-size: 20px;
  margin: 5px 0;
`;

const SuggestionsContainer = styled.ul`
  padding: 0;
`;

const SuggestionContainer = styled.li`
  border: 1px solid black;
  height: 40px;
  border-radius: 5px;
  list-style-type: none;
  margin: 5px auto;
  padding: 1px;
`;

const SuggestionHeader = styled.h1`
  text-align: center;
`;

const App = () => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  const [agency, setAgency] = useState({
    name: "",
    address: "",
    phone: "",
    website: "",
  });

  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect = ({ description, place_id }) => () => {
    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter as "false"
    setValue("", false);
    clearSuggestions();

    // Get latitude and longitude via utility functions
    getDetails(place_id)
      .then((result) => {
        setAgency({
          name: result.name,
          address: result.formatted_address,
          phone: result.formatted_phone_number,
          website: result.website,
        });
      })
      .catch((error) => {
        console.log("😱 Error: ", error);
      });
  };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;
      return (
        <SuggestionContainer key={id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </SuggestionContainer>
      );
    });

  return (
    <Page ref={ref}>
      <Input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="What is the name of the agency?"
      />

      <Input value={agency.name} onChange={handleInput} placeholder="name" />
      <Input
        value={agency.address}
        onChange={handleInput}
        placeholder="address"
      />
      <Input value={agency.phone} onChange={handleInput} placeholder="phone" />
      <Input
        value={agency.website}
        onChange={handleInput}
        placeholder="website"
      />

      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && (
        <>
          <SuggestionHeader>Suggestions</SuggestionHeader>
          <SuggestionsContainer>{renderSuggestions()}</SuggestionsContainer>
        </>
      )}
    </Page>
  );
};

export default App;
