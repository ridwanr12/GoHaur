// // src/components/SellerTabBar.js
// const SellerTabBar = ({navigation, active}) => (
//   <View style={styles.bottomNavigation}>
//     <TouchableOpacity
//       style={styles.navItem}
//       onPress={() => active !== 'home' && navigation.navigate('SellerHome')}>
//       <Image
//         source={
//           active === 'home'
//             ? require('../../assets/homeActive.png')
//             : require('../../assets/home.png')
//         }
//         style={styles.navIcon}
//       />
//       <Text style={[styles.navText, active === 'home' && styles.activeNavText]}>
//         Toko
//       </Text>
//     </TouchableOpacity>

//     <TouchableOpacity
//       style={styles.navItem}
//       onPress={() => active !== 'order' && navigation.navigate('Order')}>
//       <Image
//         source={
//           active === 'order'
//             ? require('../../assets/orderActive.png')
//             : require('../../assets/order.png')
//         }
//         style={styles.navIcon}
//       />
//       <Text
//         style={[styles.navText, active === 'order' && styles.activeNavText]}>
//         Pesanan
//       </Text>
//     </TouchableOpacity>

//     <TouchableOpacity
//       style={styles.navItem}
//       onPress={() => active !== 'profile' && navigation.navigate('Profile')}>
//       <Image
//         source={
//           active === 'profile'
//             ? require('../../assets/profileActive.png')
//             : require('../../assets/profile.png')
//         }
//         style={styles.navIcon}
//       />
//       <Text
//         style={[styles.navText, active === 'profile' && styles.activeNavText]}>
//         Profil
//       </Text>
//     </TouchableOpacity>
//   </View>
// );
