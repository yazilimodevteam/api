CREATE TABLE "Status" (
    "Id" SERIAL,
	"Name" VARCHAR(100) NOT NULL,
	CONSTRAINT "StatusIdPK" PRIMARY KEY("Id")
);

CREATE TABLE "Role" (
    "Id" SERIAL,
	"Name" VARCHAR(50) NOT NULL,
	CONSTRAINT "RoleIdPK" PRIMARY KEY("Id")
);

CREATE TABLE "User" (
    "Id" SERIAL,
	"Name" VARCHAR(50) NOT NULL,
	"Password" VARCHAR(50) NOT NULL,
	"Email" VARCHAR(80) NOT NULL,
	CONSTRAINT "UserIdPK" PRIMARY KEY("Id"),
	CONSTRAINT "UserNameUnique" UNIQUE("Name")
);
CREATE TABLE "Message" (
    "Id" SERIAL,
	"Sender_User_Id" INT NOT NULL,
	"Receiver_User_Id" INT NOT NULL,
	"Date" Date,
	"Content" TEXT,
	CONSTRAINT "MessageIdPK" PRIMARY KEY("Id"),
	CONSTRAINT "MessageSender_User_IdFK" FOREIGN KEY ("Sender_User_Id") REFERENCES "User" ("Id"),
	CONSTRAINT "MessageReceiver_User_IdFK" FOREIGN KEY ("Receiver_User_Id") REFERENCES "User" ("Id")
);
CREATE TABLE "User_Role" (
    "Id" SERIAL,
	"User_Id" INT NOT NULL,
	"Role_Id" INT NOT NULL,
	CONSTRAINT "User_RoleIdPK" PRIMARY KEY("Id"),
	CONSTRAINT "User_RoleRoleUnique" UNIQUE("User_Id","Role_Id"),
	CONSTRAINT "User_IdFK" FOREIGN KEY ("User_Id") REFERENCES "User" ("Id"),
	CONSTRAINT "User_RoleRole_IdFK" FOREIGN KEY ("Role_Id") REFERENCES "Role" ("Id")
);
CREATE TABLE "User_Status" (
    "Id" SERIAL,
	"Status_Id" INT NOT NULL,
	"User_Id" INT NOT NULL,
	CONSTRAINT "User_StatusIdPK" PRIMARY KEY("Id"),
	CONSTRAINT "User_StatusUser_IdUnique" UNIQUE("User_Id"),
	CONSTRAINT "User_StatusUser_IdFK" FOREIGN KEY ("User_Id") REFERENCES "User" ("Id"),
	CONSTRAINT "User_StatusStatus_IdFK" FOREIGN KEY ("Status_Id") REFERENCES "Status" ("Id")
);