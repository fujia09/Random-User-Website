"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/ui/animated-list";
import { MagicCard } from "@/components/ui/magic-card";
import Confetti, { ConfettiRef } from "@/components/ui/confetti";

export interface User {
  name: {
    first: string;
    last: string;
  };
  picture: {
    large: string;
  };
  email: string;
  login: {
    sha256: string;
  };
  phone: string;
}

const ReviewCard = ({
  img,
  name,
  onClick,
}: {
  img: string;
  name: string;
  email: string;
  sha256: string;
  phone: string;
  onClick: () => void;
}) => {
  return (
    <figure
      onClick={onClick}
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <img
          className="rounded-full"
          width="102"
          height="102"
          alt={name}
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
            <span className="text-sm sm:text-lg">{name}</span>
          </figcaption>
        </div>
      </div>
    </figure>
  );
};

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [randomMessage, setRandomMessage] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("https://randomuser.me/api/?results=40");
      const data = await res.json();
      setUsers(data.results);
    }
    fetchUsers();
  }, []);

  const getRandomMessage = (userName: string) => {
    const messages = [
      `${userName} wants to smash!`,
      `${userName} doesn't want to smash`,
    ];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    const message = getRandomMessage(`${user.name.first} ${user.name.last}`);
    setRandomMessage(message);

    if (message.includes("wants to smash!")) {
      setShowConfetti(true);
      confettiRef.current?.fire({});
    } else {
      setShowConfetti(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>
        <AnimatedList>
          {users.map((user) => (
            <ReviewCard
              key={user.login.sha256}
              img={user.picture.large}
              name={`${user.name.first} ${user.name.last}`}
              email={user.email}
              sha256={user.login.sha256}
              phone={user.phone}
              onClick={() => handleUserClick(user)}
            />
          ))}
        </AnimatedList>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-8 rounded-lg shadow-lg dark:bg-gray-800">
            <button
              className="absolute top-2 right-2 text-gray-700 dark:text-gray-300 z-10"
              onClick={() => {
                setSelectedUser(null);
                setRandomMessage("");
                setShowConfetti(false);
              }}
            >
              &times;
            </button>
            <MagicCard />
            <div className="mt-4 text-center">
              {randomMessage.includes("wants to smash!") && (
                <p className="text-lg font-bold dark:text-white">
                  Text {selectedUser.name.first} {selectedUser.name.last} at{" "}
                  {selectedUser.phone}
                </p>
              )}
              <p className="mt-2 text-md dark:text-white">{randomMessage}</p>{" "}
            </div>
          </div>
          {showConfetti && (
            <Confetti
              ref={confettiRef}
              className="absolute left-0 top-0 z-0 size-full"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
