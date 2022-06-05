import classnames from "classnames"
import { useAuth } from "hooks/use-auth"
import Image from "next/image"
import Link from "next/link"
import { ComponentPropsWithoutRef, FC, memo, useState } from "react"
import { Heart, Home, PlusSquare, Send } from "react-feather"
import { Avatar } from "./avatar"
import { Button } from "./buttons/button"
import { IconButton } from "./buttons/icon-button"
import { Card } from "./card"
import { PopoverMenu } from "./popover-menu"
import { CreatePostView } from "./post-form/create-post"

type NavbarProps = ComponentPropsWithoutRef<"header">

export const Navbar: FC<NavbarProps> = memo(({ className }) => {
  const { logout, loading, me } = useAuth()
  const [creatingPost, setCreatingPost] = useState(false)

  const NavigationSkeleton = () => (
    <>
      {[1, 2, 3, 4, 5].map((k) => (
        <div
          key={k}
          className="block w-7 h-7 bg-gray-300 animate-pulse rounded-full"
          style={{ animationDelay: `${k * 100}ms` }}
        />
      ))}
    </>
  )
  return (
    <>
      <CreatePostView open={creatingPost} onClose={() => setCreatingPost(false)} />
      <Card component="header" className={classnames("flex m-0 py-0 px-4 w-full sticky top-0 z-10", className)}>
        <div className="flex py-3 flex-nowrap w-full max-w-main-content mx-auto">
          <h1 className="text-lg font-bold mr-auto block">
            <Link href={"/"}>
              <a>Instaclone</a>
            </Link>
          </h1>
          <div className="menu flex space-x-6">
            {!loading && me && (
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
                      <Link href={`${me.username}`} passHref>
                        <Button className="border-b" renderAs="a">
                          Profile
                        </Button>
                      </Link>
                      <Button className="" onClick={() => logout()}>
                        Log out
                      </Button>
                    </div>
                  }
                >
                  <Avatar user={me} />
                </PopoverMenu>
              </>
            )}

            {!loading && !me && (
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

            {loading && <NavigationSkeleton />}
          </div>
        </div>
      </Card>
    </>
  )
})

Navbar.displayName = "Navbar"
