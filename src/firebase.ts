import { User } from 'discord.js';
import { initializeApp } from 'firebase/app';
import { collection, CollectionReference, deleteDoc, doc, DocumentData, getDoc, getDocs, getFirestore, setDoc } from 'firebase/firestore/lite';
import { isUndefined } from 'lodash/fp';

const firebaseConfig = {
	apiKey: 'AIzaSyB50c3a91ciOLsfLXfMPfWMHUM6v5c7sLc',
	authDomain: 'equine-army-bot.firebaseapp.com',
	projectId: 'equine-army-bot',
	storageBucket: 'equine-army-bot.appspot.com',
	messagingSenderId: '494566831655',
	appId: '1:494566831655:web:0ad840496b4801b432c002',
};

const defaultStartingMoney = 5000;

interface UserData {
    userName: string;
    avatar: string | null;
    money: number;
}

interface StartingMoney {
    money: number;
}

interface Reward {
    emojiId: number;
    money: number;
}

interface RewardWithId extends Reward {
    id: string;
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const createCollection = <T = DocumentData>(collectionName: string) => {
	return collection(db, collectionName) as CollectionReference<T>;
};

const usersCol = createCollection<UserData>('users');
const startingMoneyCol = createCollection<StartingMoney>('startingMoney');
const startingMoneyDocId = 'startingMoney';
const rewardsCol = createCollection<Reward>('rewards');

export async function setStartingMoney(money: number) {
	try {
		await setDoc(doc(startingMoneyCol, startingMoneyDocId), { money });

		const newStartMoney = await getStartingMoney();

		if (newStartMoney === money) {
			return newStartMoney;
		}
	}
	catch (error) {
		console.error('Error setting starting money', error);
	}
}

export async function getStartingMoney(): Promise<number | undefined> {
	try {
		const startingMoney = await (await getDoc(doc(startingMoneyCol, startingMoneyDocId))).data();

		if (!startingMoney) {
			const newStartMoney = await setStartingMoney(defaultStartingMoney);

			return newStartMoney;
		}
		else {return startingMoney.money;}
	}
	catch (error) {
		console.error('Error getting starting money:', error);
	}
}

export async function addUser(user: User, money: number) {
	try {
		await setDoc(doc(usersCol, user.id), {
			userName: user.username,
			avatar: user.avatarURL(),
			money,
		});
	}
	catch (error) {
		console.error('Error adding document: ', error);
	}
}

export async function getUser(user: User): Promise<UserData | undefined> {
	try {
		const userData = await (await getDoc(doc(usersCol, user.id))).data();

		if (!isUndefined(userData)) {
			return userData;
		}

		const startingMoney = await getStartingMoney();
		if (!startingMoney) {
			console.error('Error getting starting money');
		}
		else {
			await addUser(user, startingMoney);

			return { avatar: user.avatarURL(), money: startingMoney, userName: user.username };
		}
	}
	catch (error) {
		console.error('Error reading user from document: ', error);
	}
}

export async function changeUserMoney(user: User, money: number): Promise<number | undefined> {
	try {
		const userData = await getUser(user);
		if (isUndefined(userData)) {
			console.error('Error getting user data');
		}
		else {
			const newMoney = userData.money + money;
			await setDoc(doc(usersCol, user.id), {
				userName: user.username,
				avatar: user.avatarURL(),
				money: newMoney,
			});
			const updatedUserData = await getUser(user);

			if (updatedUserData?.money === newMoney) {
				return newMoney;
			}
		}
	}
	catch (error) {
		console.error('Error changing user money: ', error);
	}
}

export async function resetUserMoney(user: User): Promise<number | undefined> {
	try {
		const startMoney = await getStartingMoney();
		if (isUndefined(startMoney)) {
			console.error('Error getting starting money');
		}
		else {
			const userData = await getUser(user);
			if (isUndefined(userData)) {
				console.error('Error getting user data');
			}
			else {
				await setDoc(doc(usersCol, user.id), {
					userName: userData.userName,
					avatar: userData.avatar,
					money: startMoney,
				});
				const updatedUserData = await getUser(user);

				if (updatedUserData?.money === startMoney) {
					return startMoney;
				}
			}
		}
	}
	catch (error) {
		console.error('Error resetting user money: ', error);
	}
}

export async function getRewards(): Promise<Array<RewardWithId> | undefined> {
	try {
		return await (await getDocs(rewardsCol)).docs
			.map((x): RewardWithId => ({ emojiId: x.data().emojiId, money: x.data().money, id: x.id }));
	}
	catch (error) {
		console.error('Error getting rewards: ', error);
	}
}

export async function getReward(emojiId: number): Promise<RewardWithId | undefined> {
	try {
		const rewards = await getRewards();

		return rewards?.find(x => x.emojiId === emojiId);
	}
	catch (error) {
		console.error('Error getting reward: ', error);
	}
}

export async function setReward(reward: Reward): Promise<RewardWithId | undefined> {
	try {
		const rewards = await getRewards();

		const storedReward = (rewards || []).find(x => x.emojiId === reward.emojiId);

		if (storedReward) {
			await setDoc(doc(rewardsCol, storedReward.id), reward);
		}
		else {
			await setDoc(doc(rewardsCol), reward);
		}

		return await getReward(reward.emojiId);
	}
	catch (error) {
		console.error('Error setting reward: ', error);
	}
}

export async function deleteReward(rewardId?: string, emojiId?: number): Promise<boolean | undefined> {
	try {
		if (rewardId) {
			await deleteDoc(doc(rewardsCol, rewardId));

			return (await getRewards())?.map(x => x.id).includes(rewardId);
		}
		else if (emojiId) {
			const reward = await getReward(emojiId);
			if (reward) {
				await deleteDoc(doc(rewardsCol, reward.id));
			}

			return (await getRewards())?.map(x => x.emojiId).includes(emojiId);
		}
	}
	catch (error) {
		console.error('Error deleting reward: ', error);
	}
}
