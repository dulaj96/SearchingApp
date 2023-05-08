import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import filter from 'lodash.filter';

const API_ENDPOINT = 'https://randomuser.me/api/?results=30';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsLoading(true);
    fetchData(API_ENDPOINT);
  }, []);

  const fetchData = async url => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      setData(json.results);

      console.log(json.results);

      setFullData(json.results);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  const handleSearch = query => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(fullData, user => {
      return contains(user, formattedQuery);
    });
    setData(filteredData);
  };

  const contains = ({name, email}, query) => {
    const {first, last} = name;

    if (
      first.includes(query) ||
      last.includes(query) ||
      email.includes(query)
    ) {
      return true;
    }
    return false;
  };

  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={'large'} color="#5500dc" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>
          Error in fetching data ... Please check your internet connection!
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{flex: 1, marginHorizontal: 20}}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <TextInput
        placeholder="Search"
        clearButtonMode="always"
        style={styles.searchBox}
        autoCapitalize="none"
        autoCorrect={false}
        value={searchQuery}
        onChangeText={query => handleSearch(query)}
      />
      <FlatList
        data={data}
        keyExtractor={item => item.login.username}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <Image
              source={{uri: item.picture.thumbnail}}
              style={styles.image}
            />
            <View>
              <Text style={styles.textName}>
                {item.name.first} {item.name.last}
              </Text>
              <Text style={styles.textEmail}>{item.email}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    marginTop: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textName: {
    fontSize: 17,
    marginLeft: 10,
    fontWeight: '600',
  },
  textEmail: {
    fontSize: 14,
    marginLeft: 10,
    color: 'grey',
  },
});

export default App;
