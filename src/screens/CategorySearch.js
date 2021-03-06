import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { CheckBox } from 'react-native-elements';

import { categoryItems } from '../data/listDatas';

export default function CategorySearch() {
  const [checkedItems, setCheckedItems] = useState([]);

  const listRenderUnit = ({ item, index }) => (
    <View style={{ width: 170 }}>
      <CheckBox
        id={index}
        title={item.name}
        checkedColor="#EF904F"
        uncheckedIcon="check-circle"
        checkedIcon="check-circle"
        onPress={() => {
          setCheckedItems([...checkedItems, index]);
        }}
        checked={checkedItems.includes(index) ? true : false}
      />
    </View>
  );
  console.log(checkedItems);

  return (
    <View style={styles.container}>
      <Text style={styles.topText}>홈에서 보고싶지 않은 카테고리는 </Text>
      <Text style={styles.topText}>체크를 해제하세요.</Text>
      <Text style={styles.guideText}>
        최소 1개 이상 선택되어 있어야 합니다.
      </Text>
      <View>
        <FlatList
          data={categoryItems}
          renderItem={listRenderUnit}
          keyExtractor={(item) => item.id.toString()}
          numColumns="2"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    backgroundColor: 'white',
  },
  topText: {
    fontSize: 15,
    lineHeight: 30,
  },
  guideText: {
    fontSize: 12,
    marginTop: 20,
    color: 'gray',
    marginBottom: 30,
  },
});
