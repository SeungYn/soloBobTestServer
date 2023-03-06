import * as partyRepository from '../data/party.js';
import * as userRepository from '../data/auth.js';

export async function getPartyByRestaurantId(req, res) {
  const { restaurantId } = req.params;
  // const user = await userRepository.findById(req.userId);
  // if (user.master || data.currentParty) {
  //   res.status(401).json({ message: '파티가 가입되있거나 파티장입니다.' });
  // }

  const party = await partyRepository.getPartyByRestaurantId(restaurantId);
  console.log(party);
  res.status(200).json({ party: party });
}

export async function makeParty(req, res) {
  const { id, title, maximumCount } = req.body;
  console.log('make');
  const party = await partyRepository.makeParty(id, title, maximumCount);
}

export async function makeParty2(req, res) {
  const { title, maximumCount } = req.body;
  const { resId } = req.params;
  const user = await userRepository.findById(req.userId);

  if (!user) {
    return res.status(404).json({ message: 'user not found' });
  }

  if (user.partyId) {
    return res.status(404).json({ message: '이미 파티가 존재합니다.' });
  }

  const party = await partyRepository.createPartyByRestaurantId(
    req.userId,
    resId,
    title,
    maximumCount,
    user.nickname
  );

  const partyUserInfo = await userRepository.joinPartyByPartyId(
    party.id,
    req.userId
  );
  const members = await userRepository.findUsersByPartyId(party.id);
  party['members'] = members;

  res.status(201).json({ ...party, currentCount: members.length });
}

//유저가 소속된 파티 가져오기
export async function getMyParty(req, res) {
  console.log('party');
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'user not found' });
  }

  const party = await partyRepository.getPartyByPartyId(user.partyId);
  if (!party) {
    return res
      .status(400)
      .json({ code: '2200', message: '파티가 존재하지 않습니다.' });
  }

  const members = await userRepository.findUsersByPartyId(party.id);
  party['members'] = members;
  console.log(party);
  res.status(201).json({ ...party, currentCount: members.length });
}

//파티 참가
export async function joinParty(req, res) {
  const user = await userRepository.findById(req.userId);
  const { partyId } = req.params;
  // if (!user) {
  //   return res.status(404).json({ message: 'user not found' });
  // }
  const { currentCount, maximumCount } =
    await partyRepository.currentMaxCountByPartyId(partyId);

  let party = await partyRepository.getPartyByPartyId(partyId);
  if (user.partyId !== null) {
    return res
      .status(400)
      .json({ code: 2203, message: '이미 파티에 소속되어 있습니다.' });
  }

  if (currentCount === maximumCount) {
    return res
      .status(400)
      .json({ code: 2202, message: '인원이 가득 찼습니다.' });
  }

  if (!party) {
    return res
      .status(400)
      .json({ code: 2200, message: '파티가 존재하지 않습니다.' });
  }

  await userRepository.joinPartyByPartyId(partyId, req.userId);
  await partyRepository.increaseCountByPartyId(partyId);
  party = await partyRepository.getPartyByPartyId(partyId);
  //파티 현재인원수 수정 필요
  const members = await userRepository.findUsersByPartyId(partyId);
  party['members'] = members;

  res.status(201).json(party);
}

//파티나가기
export async function outParty(req, res) {
  const { partyId } = req.params;
  const user = await userRepository.findById(req.userId);

  if (user.partyId) {
    partyRepository.decreaseCountByPartyId(partyId);
    userRepository.outParty(user.id);

    if (user.owner) {
      const members = await userRepository.findUsersByPartyId(partyId);
      if (members.length > 1) {
        for (let i = 0; i < members.length; i++) {
          if (members[i].id != user.id) {
            await userRepository.ownerRegister(members[i].id);
            break;
          }
        }
      }
    }
    res.status(200).json('ok');
  } else {
    return res
      .status(400)
      .json({ code: '2200', message: '파티가 존재하지 않습니다.' });
  }

  res.status(200);
}

//파티 준비, 시작
export async function partyReady(req, res) {
  //사용자가 방장이면 파티 시작 아니면 준비

  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(401).json({ message: '유저 정보가 없음' });
  }

  if (user.owner) {
    await partyRepository.startPartyByPartyId(user.partyId);
  } else {
    console.log('ready');
    user.isReady
      ? await userRepository.unReady(req.userId)
      : await userRepository.onReady(req.userId);
  }
  const party = await partyRepository.getPartyByPartyId(user.partyId);

  const members = await userRepository.findUsersByPartyId(user.partyId);
  party['members'] = members;
  res.status(200).json(party);
}
