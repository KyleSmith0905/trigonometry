import { firestore } from '@/helpers/firebase';
import { Capacitor } from '@capacitor/core';
import { collection, doc, type DocumentData } from 'firebase/firestore';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useCurrentUser, useDocument, type _RefFirestore } from 'vuefire';

export const useUserData = defineStore('userData', () => {
  const userAuth = useCurrentUser();
  const userData = ref<_RefFirestore<DocumentData | undefined>>();
  const isPremium = ref<boolean>(false);

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
    const document = useDocument(doc(collection(firestore, 'users'), `${userId}`));
    userData.value = document;

    const documentData = await document.promise.value;
    if (!isNative) {
      isPremium.value = documentData?.membership === 'premium';
    }
  })

  return {userAuth, userData, isPremium}
})
