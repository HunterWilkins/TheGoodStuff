const bcrypt = require("bcryptjs");

module.exports = function(sequelize, DataTypes) {
    let User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                args:true,
                msg: "Email address is already in use"
            },
            validate: {
                isEmail:true,
            },
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    User.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    }

    User.associate = (models) => {
        User.hasMany(models.Comment, {
            onDelete: "cascade"
        });
    }
    
    User.addHook("beforeCreate", function(user) {
        user.password = bcrypt.hashSync(
            user.password,
            bcrypt.genSaltSync(12),
            null
        );
    });

    return User
}