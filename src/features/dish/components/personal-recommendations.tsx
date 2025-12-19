import { useTranslations } from "next-intl";
import { Heart, User } from "lucide-react";
import { Link } from "@/i18n/routing";
import { signInPath } from "@/paths";
import { getPersonalRecommendations } from "../queries/get-personal-recommendations";

export async function PersonalRecommendations() {
    const t = useTranslations();
    const { isLoggedIn, favorites, recommendations } = await getPersonalRecommendations();

    return (
        <section className="card-base p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    {t("home.personalRecommend.title")}
                </h3>
            </div>

            {!isLoggedIn ? (
                <div className="text-center py-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-muted-foreground mb-4">{t("home.personalRecommend.loginTip")}</p>
                    <Link
                        href={signInPath}
                        className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        {t("auth.signIn")}
                    </Link>
                </div>
            ) : favorites.length === 0 ? (
                <div className="text-center py-6">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                        <Heart className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">{t("home.personalRecommend.noFavorites")}</p>
                </div>
            ) : (
                <div>
                    <p className="text-sm text-muted-foreground mb-3">
                        {t("home.personalRecommend.basedOnFavorites")}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        {(recommendations.length > 0 ? recommendations : favorites).slice(0, 4).map((dish) => (
                            <div
                                key={dish.id}
                                className="bg-card rounded-lg overflow-hidden border border-border"
                            >
                                <div className="aspect-square bg-muted flex items-center justify-center">
                                    {dish.image ? (
                                        <img
                                            src={dish.image}
                                            alt={dish.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        "🍜"
                                    )}
                                </div>
                                <div className="p-2">
                                    <h4 className="font-medium text-sm truncate">{dish.name}</h4>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {dish.description}
                                    </p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-primary font-semibold text-sm">
                                            ¥{dish.price.toString()}
                                        </span>
                                        <button className="bg-primary text-primary-foreground w-5 h-5 rounded-full text-xs">
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
