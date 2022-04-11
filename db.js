const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const faker = require('faker');
const Sequelize = require('sequelize');
const { STRING } = Sequelize;
const config = {
  logging: false
};

if(process.env.LOGGING){
  delete config.logging;
}
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_db', config);

const User = conn.define('user', {
  username: STRING,
  password: STRING
});

User.addHook('beforeSave', async(user)=> {
  if(user.changed('password')){
    const hashed = await bcrypt.hash(user.password, 3);
    user.password = hashed;
  }
});

User.byToken = async(token)=> {
  try {
    const payload = await jwt.verify(token, process.env.JWT);
    const user = await User.findByPk(payload.id, {
      attributes: {
        exclude: ['password']
      }
    });
    if(user){
      return user;
    }
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
  catch(ex){
    const error = Error('bad credentials');
    error.status = 401;
    throw error;
  }
};

User.authenticate = async({ username, password })=> {
  const user = await User.findOne({
    where: {
      username
    }
  });
  if(user && await bcrypt.compare(password, user.password) ){
    return jwt.sign({ id: user.id}, process.env.JWT); 
  }
  const error = Error('bad credentials!!!!!!');
  error.status = 401;
  throw error;
};

const Note = conn.define('note', {
  txt: STRING(1000)
});

Note.belongsTo(User);
User.hasMany(Note);

const syncAndSeed = async()=> {
  await conn.sync({ force: true });
  const credentials = [
    { username: 'lucy', password: 'lucy_pw'},
    { username: 'moe', password: 'moe_pw'},
    { username: 'larry', password: 'larry_pw'}
  ];
  const [lucy, moe, larry] = await Promise.all(
    credentials.map( credential => User.create(credential))
  );
  const [one, two, three, four, five, six, seven, eight, nine, ten] = await Promise.all([
    Note.create({txt: faker.lorem.paragraph()}),
    Note.create({txt: faker.lorem.paragraph()}),
    Note.create({txt: faker.lorem.paragraph()}),
    Note.create({txt: faker.lorem.paragraph()}),
    Note.create({txt: faker.lorem.paragraph()}),
    Note.create({txt: faker.lorem.paragraph()}),
    Note.create({txt: faker.lorem.paragraph()}),
    Note.create({txt: faker.lorem.paragraph()}),
    Note.create({txt: faker.lorem.paragraph()}),
    Note.create({txt: faker.lorem.paragraph()})
  ]);
  one.userId = lucy.id;
  two.userId = lucy.id;
  three.userId = moe.id;
  four.userId = moe.id;
  five.userId = moe.id;
  six.userId = larry.id;
  seven.userId = moe.id;
  eight.userId = larry.id;
  nine.userId = lucy.id;
  ten.userId = larry.id;
  await Promise.all([
    one.save(),
    two.save(),
    three.save(),
    four.save(),
    five.save(),
    six.save(),
    seven.save(),
    eight.save(),
    nine.save(),
    ten.save()
  ]);
  return {
    users: {
      lucy,
      moe,
      larry
    },
    notes: {
      one, 
      two, 
      three,
      four,
      five,
      six,
      seven,
      eight,
      nine,
      ten
    }
  };
};

module.exports = {
  syncAndSeed,
  models: {
    User,
    Note
  }
};
