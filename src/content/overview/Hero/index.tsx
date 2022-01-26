import {
	Box,
	Button,
	Container,
	Grid,
	Typography
} from '@mui/material';

import { Link as RouterLink } from 'react-router-dom';

import { styled } from '@mui/material/styles';

const TypographyH1 = styled(Typography)(
	({ theme }) => `
    font-size: ${theme.typography.pxToRem(50)};
`
);

const TypographyH2 = styled(Typography)(
	({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
);

const LabelWrapper = styled(Box)(
	({ theme }) => `
    background-color: ${theme.colors.success.main};
    color: ${theme.palette.success.contrastText};
    font-weight: bold;
    border-radius: 30px;
    text-transform: uppercase;
    display: inline-block;
    font-size: ${theme.typography.pxToRem(11)};
    padding: ${theme.spacing(.5)} ${theme.spacing(1.5)};
    margin-bottom: ${theme.spacing(2)};
`
);

const MuiAvatar = styled(Box)(
	({ theme }) => `
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    border-radius: ${theme.general.borderRadius};
    background-color: #e5f7ff;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing(2)};

    img {
      width: 60%;
      height: 60%;
      display: block;
    }
`
);

const TsAvatar = styled(Box)(
	({ theme }) => `
    width: ${theme.spacing(8)};
    height: ${theme.spacing(8)};
    border-radius: ${theme.general.borderRadius};
    background-color: #dfebf6;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto ${theme.spacing(2)};

    img {
      width: 70%;
      height: 70%;
      display: block;
    }
`
);

function Hero() {

	return (
		<Container maxWidth="lg" sx={{ textAlign: 'center' }}>
			<Grid spacing={{ xs: 6, md: 10 }} justifyContent="center" alignItems="center" container>
				<Grid item md={10} lg={8} mx="auto">
					<LabelWrapper color="success">Version 0.1</LabelWrapper>
					<TypographyH1 sx={{ mb: 2 }} variant="h1">
						Cinna's T10 Tracker
					</TypographyH1>
					<TypographyH2
						sx={{ lineHeight: 1.5, pb: 4 }}
						variant="h4"
						color="text.secondary"
						fontWeight="normal"
					>
						A more visually polished and feature-rich tracker, for the modern era of Bang Dream tiering!
					</TypographyH2>
					<Button
						component={RouterLink}
						to="/dashboards/tracker"
						size="large"
						variant="contained"
					>
						Track T10
					</Button>
					<Grid container spacing={3} mt={5}>
						<Grid item md={4}>
							<TsAvatar>
								<img src="/static/images/logo/Bestdori-Logo.png" alt="Bestdori logo" />
							</TsAvatar>
							<Typography variant="h4">
								<Box sx={{ pb: 2 }}><b>Data from Bestdori</b></Box>
								<Typography component="span" variant="subtitle2">Data generously provided by <a href="http://bestdori.com">Bestdori</a>. If their service is down, so are we!</Typography>
							</Typography>
						</Grid>
						<Grid item md={4}>
							<TsAvatar>
								<img src="/static/images/logo/typescript.svg" alt="Typescript" />
							</TsAvatar>
							<Typography variant="h4">
								<Box sx={{ pb: 2 }}><b>Built with Typescript</b></Box>
								<Typography component="span" variant="subtitle2">All data is processed client side in typescript.</Typography>
							</Typography>
						</Grid>
						<Grid item md={4}>
							<TsAvatar>
								<img src="/static/images/logo/hinahikawatypingveryquickly.gif" alt="hina hikawa typing" />
							</TsAvatar>
							<Typography variant="h4">
								<Box sx={{ pb: 2 }}><b>Powered by Hina Hikawa</b></Box>
								<Typography component="span" variant="subtitle2">Inside this website are a thousand tiny Hina Hikawas typing extremely quickly to bring you the latest data.</Typography>
							</Typography>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Container>
	);
}

export default Hero;
