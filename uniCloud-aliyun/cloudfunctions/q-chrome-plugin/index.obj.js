// q-chrome-plugin-user 储存每一个用户信息
// q-chrome-plugin-list  储存每一个用户的list
const db = uniCloud.database();
const userColl = db.collection("q-chrome-plugin-user");
const listColl = db.collection("q-chrome-plugin-list");
function getBody(val) {
	const bodystr = val.__internalObject.event.body;
	return JSON.parse(bodystr)
}
module.exports = {
	_before: async function () {
		
	},
	login: async function () {
		const {username, password} = getBody(this)
		if (!username || !password) {
			return {
				code: -1,
				msg: '请输入用户名和密码'
			}
		}
		const res = await userColl.where({
			username,
			password
		}).get();
		if (res.data.length > 0) {
			return {
				code: 0,
				msg: '登录成功',
				data: res.data[0]
			}
		} else {
			return {
				code: -1,
				msg: '用户名或密码错误'
			}
		}
	},
	register: async function (params) {
		const {username, password, nickname} = getBody(this)
		if (!username || !password || !nickname) {
			return {
				code: -1,
				msg: '请输入完整信息'
			}
		}
		const countRes = await userColl.where({
			username
		}).count();
		if (countRes.total > 0) {
			return {
				code: -1,
				msg: '用户已存在'
			}
		}
		const res = await userColl.add({
			username,
			password,
			nickname,
			create_date: Date.now()
		});
		return {
			code: 0,
			msg: '注册成功',
			data: res
		}
	},
	getList: async function () {
		const { user_id } = getBody(this);
		if (!user_id) {
			return { code: -1, msg: '未登录' };
		}
		const res = await listColl.where({ user_id }).get();
		return {
			code: 0,
			data: res.data.length > 0 ? res.data[0].list : []
		};
	},
	updateList: async function () {
		const { user_id, list } = getBody(this);
		if (!user_id) {
			return { code: -1, msg: '未登录' };
		}
		const res = await listColl.where({ user_id }).get();
		if (res.data.length > 0) {
			await listColl.doc(res.data[0]._id).update({ list });
		} else {
			await listColl.add({ user_id, list });
		}
		return { code: 0, msg: '保存成功' };
	},
	removeSite: async function () {
		const { user_id, key } = getBody(this);
		if (!user_id) {
			return { code: -1, msg: '未登录' };
		}
		const res = await listColl.where({ user_id }).get();
		if (res.data.length > 0) {
			const docId = res.data[0]._id;
			const list = res.data[0].list || [];
			const newList = list.filter(item => item.key !== key);
			await listColl.doc(docId).update({ list: newList });
			return { code: 0, msg: '删除成功', data: newList };
		}
		return { code: -1, msg: '数据不存在' };
	}
}
