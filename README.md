# くものうえ、うた (Music on Clouds)
## for Hatsune Miku "Magical Mirai 2023" Programming Contest

「音楽が私たちとミクをつなぐ」という発想に基づいて、ミクと私たちの間をふさぐ雲をヒーローミクが歌いながら歩くと歌がその雲をなくすという感じの作品を作りました。

画面の任意の位置をクリックすると、ミクがその位置に移動します。 このとき、左クリックすると雲を消しながら移動し、右クリックすると雲は消えません。 モバイルでは左下に追加のボタンを追加し、移動時に雲を消すか選べます。 雲の上に雲を描きながら遊ぶこともでき、下にいる観客（私たち）を全部見るために雲を全部消してしまうことを目標にプレイすることもできます。

上下左右の4方向に全部ミクが動くスプライトアニメーションが実装されています。

歌詞は基本的にミクが動く時はミクが動いた場所にでき、停止している時はミクを中心に螺旋形で現れます。 ただし、ミクが端に停止しているときは運が悪いとき文字間の重畳が起こることがあります。(過去版の問題でしたが、まだ最終版にも残っている可能性があるので記入しました。) また、ミクの速さが遅すぎると文字間の重なりが発生することもあります。

晴天を表す虹からインスピレーションを得て、全部で5色が順番に歌詞の色になります。 また、長い間登場した歌詞はますます透明になり、小さくなります。 これにより、先に登場した歌詞と後で登場した歌詞を区別できるようになりました。

左上にはスクリーンショットモードボタンがあります。 これを押すとき、雲ボタンなどUI を一時的に隠します。 押し直すと、元の状態に戻ります。

右上には二つのボタンがあります。 上の雲型ボタンは、画面の雲を埋め直すボタンです。 雲の形は常にランダムに生成されます。 下の歯車状のボタンを押すとパネルが一つ出ます。 パネルには3つのスライディングバーがあり、それぞれ雲が消す幅、雲が消えた場所と残っている場所との境界の柔らかさ、そしてミクが動く速度を調整します。

上段中間の三角形が描かれたボタンを押すと、あらかじめ設定された11個の絵を描くことができるボタンが11個登場します。 このうち上の7つは「パーティクル」を描きますが、「パーティクル」は現在ミクが位置する位置を基準に描かれます。 基準点はボタンで赤い点で表示されています。 以下の5つは「セット」を描きますが、「セット」は画面全体を基準に決められた絵を描きます。 自動的に絵を描いている間は、ユーザーが任意でミクを動かすことができません。

このコンテストに参加できて光栄でした。 開催してくださったすべての方々に感謝いたします。

---

(English)

Based on the idea that [Music connects Miku and us], the clouds blocking us from Miku are cleared by the music of Hero Miku singing and walking on the clouds in this program.

If you click an arbitrary position on the screen, Miku moves to that position. Clicking the left button of the mouse enables Miku to clear clouds while she walks, while clicking the right button makes Miku only move. For mobile users, a button on the left-bottom enables users to select if they want to clear the clouds or not in the next move. Users can play by either drawing on the cloud or clearing all of the clouds to see the audiences(us).

Miku's sprite animations are all implemented in 4 directions: up, down, right, and left.

The lyric characters appear where Miku has moved if she is moving. If she is staying still, the characters appear as a spiral shape around her. However, if Miku is in the corner of the screen, there may be some overlaps between the characters in unlucky situations. (It was a problem for the previous version, but it might still be in the final version.) Also, if Miku's speed is too slow, the characters can also be overlapped.

Colors from the rainbow which is the symbol of a clear sky, the lyric character's colors are changing constantly between some 5 colors. Also, the character becomes more transparent and smaller after it appears. This enables users to distinguish between new characters and old characters.

On the left top, there is a screenshot button. If you press it, UI like the cloud refill button is hidden. If you press it again, it goes back to its original state.

On the right top, there are 2 buttons. The upper cloud-shaped button is the button for refilling the background's cloud. The shape of the clouds is always random. If you press the lower gear-shaped button, a panel comes out. There are 3 slides in the panel: each operates the width of the cloud clearing, the blur of the border between the cloud and where the cloud is cleaned, and the speed of Miku.

In the upper middle, there is a triangle-shaped button. If you click this button, 11 buttons which you can draw shapes that are already set. The upper 7 buttons are for "Particles", which are drawn starting from the original position of Miku. The starting position in the shape is indicated with a red dot in the button. In contrast, the lower 5 buttons are for “Sets”, which draw shapes based on the full screen’s coordinates. While drawing automatically, the user can’t move Miku of their own accord.

It was a great honor for participating in this contest. I really appreciate you for opening this contest.
