import classnames from "classnames"
import { useAuth } from "hooks/use-auth"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import sloth from "public/sloth.jpg"
import { ComponentPropsWithoutRef, FC } from "react"
import { Heart, Home, PlusSquare, Send } from "react-feather"
import { Button } from "./button"
import { Card } from "./card"
import { IconButton } from "./icon-button"
import { PopoverMenu } from "./popover-menu"

type NavbarProps = ComponentPropsWithoutRef<"header">

export const Navbar: FC<NavbarProps> = ({ className }) => {
  const router = useRouter()
  const { me, loading, logout } = useAuth()

  return (
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
                <IconButton title="Home" asLink>
                  <Home />
                </IconButton>
              </Link>
              <Link href={"direct"} passHref>
                <IconButton title="Direct" asLink>
                  <Send />
                </IconButton>
              </Link>
              <Link href={"create"} passHref>
                <IconButton title="Create" asLink>
                  <PlusSquare />
                </IconButton>
              </Link>
              <Link href={"likes"} passHref>
                <IconButton title="Liked" asLink>
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
                <Button mode="primary" asLink>
                  Login
                </Button>
              </Link>
              <Link href={"register"} passHref>
                <Button mode="secondary" asLink>
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}
