import { firestore } from '@/helpers/firebase';
import { Capacitor } from '@capacitor/core';
import { collection, doc, onSnapshot, type DocumentData, type Unsubscribe } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useCurrentUser } from 'vuefire';

export const useUserData = defineStore('userData', () => {
  const userAuth = useCurrentUser();
  const userData = ref<DocumentData | undefined>();
  const isPremium = ref<boolean>(false);
  const userDataUnsubscribe = ref<Unsubscribe>()

  // Mobile automatically comes with premium
  const isNative = Capacitor.getPlatform() !== 'web';
  if (isNative) isPremium.value = true;
  
  watch([userAuth], async ([currentUser]) => {
    const userId = currentUser?.uid;
    if (!userId) {
      if (!isNative) {
        userData.value = undefined;
        isPremium.value = false;
      }
      return;
    };

    if (userDataUnsubscribe.value) {
      userDataUnsubscribe.value();
    }

    userDataUnsubscribe.value = onSnapshot(doc(collection(firestore, 'users'), `${userId}`), {
      next: (document) => {
        userData.value = document.data();
        if (!isNative) {
          isPremium.value = userData.value?.membership === 'premium';
        }
      }
    });
  })

  return {userAuth, userData, isPremium}
})
