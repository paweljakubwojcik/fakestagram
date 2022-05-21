import classnames from "classnames"
import { useAuth } from "hooks/use-auth"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import sloth from "public/sloth.jpg"
import { ComponentPropsWithoutRef, FC, useState } from "react"
import { Heart, Home, PlusSquare, Send } from "react-feather"
import { Button } from "./buttons/button"
import { Card } from "./card"
import { IconButton } from "./buttons/icon-button"
import { PopoverMenu } from "./popover-menu"
import { CreatePostView } from "./views/create-post"

type NavbarProps = ComponentPropsWithoutRef<"header">

export const Navbar: FC<NavbarProps> = ({ className }) => {
  const { me, loading, logout } = useAuth()
  const [creatingPost, setCreatingPost] = useState(false)

  return (
    <>
      <CreatePostView open={creatingPost} onClose={() => setCreatingPost(false)} />
      <Card component="header" className={classnames("flex m-0 py-0 px-4  w-full", className)}>
        <div className="flex py-3 flex-nowrap w-full max-w-main-content mx-auto">
          <h1 className="text-lg font-bold mr-auto block">
            <Link href={"/"}>
              <a>Instaclone</a>
            </Link>
          </h1>
          <div className="menu flex space-x-6">
            {me ? (
              <>
                <Link href={"/"} passHref>
                  <IconButton title="Home" renderAs="a">
                    <Home />
                  </IconButton>
                </Link>
                <Link href={"direct"} passHref>
                  <IconButton title="Direct" renderAs="a">
                    <Send />
                  </IconButton>
                </Link>
                <IconButton title="Create" onClick={() => setCreatingPost(true)}>
                  <PlusSquare />
                </IconButton>
                <Link href={"likes"} passHref>
                  <IconButton title="Liked" renderAs="a">
                    <Heart />
                  </IconButton>
                </Link>
                <PopoverMenu
                  content={
                    <div className="w-52 flex flex-col items-stretch">
                      <Button className="border-0" onClick={() => logout()}>
                        Log out
                      </Button>
                    </div>
                  }
                >
                  <Image
                    src={sloth}
                    alt={`${me?.username} profile image`}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                </PopoverMenu>
              </>
            ) : (
              <>
                <Link href={"login"} passHref>
                  <Button mode="primary" renderAs="a">
                    Login
                  </Button>
                </Link>
                <Link href={"register"} passHref>
                  <Button mode="secondary" renderAs="a">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Card>
    </>
  )
}
